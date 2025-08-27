import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Container } from '../containers/container.entity'
import { Truck } from '../trucks/truck.entity'
import { RouteAssignment, AssignmentStatus } from './route-assignment.entity'
import type { OptimizeRouteDto } from './dto/optimize-route.dto'

export interface Point {
  lat: number
  lng: number
  id?: string
  priority?: number
}

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>,
    @InjectRepository(RouteAssignment)
    private routeAssignmentRepository: Repository<RouteAssignment>,
  ) {}

  async optimizeRoute(data: OptimizeRouteDto) {
    const containers = await this.getFilteredContainers(data)
    const depot = { lat: data.startLat, lng: data.startLng }
    const trucks = await this.getAvailableTrucks(data.city)
    
    // Use Sweep + Dijkstra for VRP
    const vrpSolution = this.solveVRP(depot, containers, trucks)
    
    return {
      routes: vrpSolution.routes,
      totalDistance: vrpSolution.totalDistance,
      containerCount: containers.length,
      estimatedTime: vrpSolution.estimatedTime,
      trucksUsed: vrpSolution.trucksUsed,
    }
  }

  private async getFilteredContainers(data: OptimizeRouteDto) {
    const cityBounds = this.getCityBounds(data.city)
    let query = this.containerRepository
      .createQueryBuilder('container')
      .where('container.latitude BETWEEN :minLat AND :maxLat', {
        minLat: cityBounds.minLat,
        maxLat: cityBounds.maxLat,
      })
      .andWhere('container.longitude BETWEEN :minLng AND :maxLng', {
        minLng: cityBounds.minLng,
        maxLng: cityBounds.maxLng,
      })

    if (data.wasteTypes && data.wasteTypes.length > 0) {
      query = query.andWhere('container.wasteLevel IN (:...wasteTypes)', {
        wasteTypes: data.wasteTypes,
      })
    }

    return query.getMany()
  }

  private getCityBounds(city: string) {
    const bounds = {
      'Bogotá D.C., Colombia': {
        minLat: 4.597,
        maxLat: 4.76,
        minLng: -74.147,
        maxLng: -74.047,
      },
      'Madrid, Spain': {
        minLat: 40.39,
        maxLat: 40.47,
        minLng: -3.75,
        maxLng: -3.65,
      },
    }
    return bounds[city] || bounds['Bogotá D.C., Colombia']
  }



  private findNearest(current: Point, points: Point[]): Point {
    if (points.length === 0) return current
    return points.reduce((nearest, point) => {
      const currentDist = this.calculateDistance(current, point)
      const nearestDist = this.calculateDistance(current, nearest)
      return currentDist < nearestDist ? point : nearest
    })
  }

  private findNearestWithPriority(current: Point, points: Point[]): Point {
    if (points.length === 0) return current

    // Find highest priority containers first
    const maxPriority = Math.max(...points.map(p => p.priority || 1))
    const highPriorityPoints = points.filter(
      p => (p.priority || 1) === maxPriority,
    )

    // Among high priority containers, find the nearest
    return highPriorityPoints.reduce((nearest, point) => {
      const currentDist = this.calculateDistance(current, point)
      const nearestDist = this.calculateDistance(current, nearest)
      return currentDist < nearestDist ? point : nearest
    })
  }

  private clusterContainers(
    points: Point[],
    maxDistanceKm: number,
  ): Array<{ center: Point; containers: Point[] }> {
    const clusters = []
    const unprocessed = [...points]

    while (unprocessed.length > 0) {
      const seed = unprocessed.shift()
      const cluster = [seed]

      // Find all containers within 500m of the seed
      for (let i = unprocessed.length - 1; i >= 0; i--) {
        const distance = this.calculateDistance(seed, unprocessed[i])
        if (distance <= maxDistanceKm) {
          cluster.push(unprocessed.splice(i, 1)[0])
        }
      }

      // Sort cluster by priority
      cluster.sort((a, b) => (b.priority || 1) - (a.priority || 1))

      clusters.push({
        center: seed,
        containers: cluster,
      })
    }

    return clusters
  }

  private findNearestCluster(
    current: Point,
    clusters: Array<{ center: Point; containers: Point[] }>,
  ): { center: Point; containers: Point[] } {
    return clusters.reduce((nearest, cluster) => {
      const currentDist = this.calculateDistance(current, cluster.center)
      const nearestDist = this.calculateDistance(current, nearest.center)
      return currentDist < nearestDist ? cluster : nearest
    })
  }

  private sweepAlgorithm(
    start: Point,
    end: Point,
    clusters: Array<{ center: Point; containers: Point[] }>,
  ): Point[] {
    if (clusters.length === 0) return [start, end]

    // Sort clusters by angle from start point (sweep line approach)
    const clustersWithAngle = clusters.map(cluster => ({
      ...cluster,
      angle: Math.atan2(
        cluster.center.lat - start.lat,
        cluster.center.lng - start.lng,
      ),
      priority: Math.max(...cluster.containers.map(c => c.priority || 1)),
    }))

    // Sort by priority first, then by angle for efficient sweep
    clustersWithAngle.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return a.angle - b.angle
    })

    const route = [start]

    // Visit clusters in sweep order, collecting all containers in each
    clustersWithAngle.forEach(cluster => {
      // Sort containers within cluster by priority and proximity
      const sortedContainers = cluster.containers.sort((a, b) => {
        if ((b.priority || 1) !== (a.priority || 1)) {
          return (b.priority || 1) - (a.priority || 1)
        }
        const lastPoint = route[route.length - 1]
        const distA = this.calculateDistance(lastPoint, a)
        const distB = this.calculateDistance(lastPoint, b)
        return distA - distB
      })

      route.push(...sortedContainers)
    })

    route.push(end)
    return route
  }

  private calculateDistance(p1: Point, p2: Point): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(p2.lat - p1.lat)
    const dLng = this.toRad(p2.lng - p1.lng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.lat)) *
        Math.cos(this.toRad(p2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  private calculateTotalDistance(route: Point[]): number {
    let total = 0
    for (let i = 0; i < route.length - 1; i++) {
      total += this.calculateDistance(route[i], route[i + 1])
    }
    return Math.round(total * 100) / 100
  }

  private estimateTime(route: Point[]): number {
    const distance = this.calculateTotalDistance(route)
    const avgSpeed = 30 // km/h
    return Math.round((distance / avgSpeed) * 60) // minutes
  }

  private async getAvailableTrucks(city: string) {
    return this.truckRepository.find({
      where: { city, available: true },
    })
  }

  private solveVRP(depot: Point, containers: Container[], trucks: Truck[]) {
    if (containers.length === 0) {
      return {
        routes: [],
        totalDistance: 0,
        estimatedTime: 0,
        trucksUsed: 0,
      }
    }

    const points = containers.map(c => ({
      lat: Number(c.latitude),
      lng: Number(c.longitude),
      id: c.id,
      priority: c.wasteLevel === 'heavy' ? 3 : c.wasteLevel === 'medium' ? 2 : 1,
    }))

    // Sweep algorithm: sort points by polar angle from depot
    const sortedPoints = this.sweepSort(depot, points)
    
    // Partition into truck routes based on capacity
    const routes = this.partitionIntoRoutes(depot, sortedPoints, trucks)
    
    // Apply Dijkstra to optimize each route
    const optimizedRoutes = routes.map(route => this.dijkstraOptimize(route))
    
    const totalDistance = optimizedRoutes.reduce((sum, route) => 
      sum + this.calculateTotalDistance(route.points), 0)
    
    return {
      routes: optimizedRoutes,
      totalDistance: Math.round(totalDistance * 100) / 100,
      estimatedTime: Math.round((totalDistance / 30) * 60),
      trucksUsed: optimizedRoutes.length,
    }
  }

  private sweepSort(depot: Point, points: Point[]): Point[] {
    return points.sort((a, b) => {
      const angleA = Math.atan2(a.lat - depot.lat, a.lng - depot.lng)
      const angleB = Math.atan2(b.lat - depot.lat, b.lng - depot.lng)
      return angleA - angleB
    })
  }

  private partitionIntoRoutes(depot: Point, points: Point[], trucks: Truck[]) {
    const routes = []
    const maxPointsPerTruck = Math.ceil(points.length / trucks.length)
    
    for (let i = 0; i < trucks.length && i * maxPointsPerTruck < points.length; i++) {
      const start = i * maxPointsPerTruck
      const end = Math.min(start + maxPointsPerTruck, points.length)
      const routePoints = points.slice(start, end)
      
      routes.push({
        truckId: trucks[i].id,
        truckName: trucks[i].name,
        points: [depot, ...routePoints, depot],
      })
    }
    
    return routes
  }

  private dijkstraOptimize(route: { truckId: string; truckName: string; points: Point[] }) {
    // Simple nearest neighbor optimization for each route
    const { points } = route
    if (points.length <= 3) return route // depot + depot only
    
    const optimized = [points[0]] // start depot
    const unvisited = points.slice(1, -1) // exclude depots
    let current = points[0]
    
    while (unvisited.length > 0) {
      const nearest = this.findNearest(current, unvisited)
      const index = unvisited.indexOf(nearest)
      unvisited.splice(index, 1)
      optimized.push(nearest)
      current = nearest
    }
    
    optimized.push(points[points.length - 1]) // end depot
    
    return {
      ...route,
      points: optimized,
    }
  }

  async assignRoute(data: {
    routeName: string
    routeData: any
    truckId: string
    operatorId: string
    supervisorId: string
    city: string
  }) {
    const assignment = this.routeAssignmentRepository.create({
      ...data,
      status: AssignmentStatus.PENDING,
    })
    
    await this.routeAssignmentRepository.save(assignment)
    
    // Mark truck as unavailable
    await this.truckRepository.update(data.truckId, { available: false })
    
    return assignment
  }

  async getAssignments(operatorId?: string) {
    const where = operatorId ? { operatorId } : {}
    return this.routeAssignmentRepository.find({ where })
  }

  async updateAssignmentStatus(id: string, status: AssignmentStatus) {
    const assignment = await this.routeAssignmentRepository.findOne({ where: { id } })
    if (!assignment) throw new Error('Assignment not found')
    
    assignment.status = status
    
    // If completed, mark truck as available
    if (status === AssignmentStatus.COMPLETED) {
      await this.truckRepository.update(assignment.truckId, { available: true })
    }
    
    return this.routeAssignmentRepository.save(assignment)
  }

  async getTrucks(city?: string) {
    const where = city ? { city } : {}
    return this.truckRepository.find({ where })
  }

  async createTruck(data: Partial<Truck>) {
    const truck = this.truckRepository.create(data)
    return this.truckRepository.save(truck)
  }
}
