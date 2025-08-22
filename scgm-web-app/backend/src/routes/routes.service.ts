import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container, WasteLevel } from '../containers/container.entity';
import { OptimizeRouteDto } from './dto/optimize-route.dto';

export interface Point {
  lat: number;
  lng: number;
  id?: string;
  priority?: number;
}

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
  ) {}

  async optimizeRoute(data: OptimizeRouteDto) {
    const containers = await this.getFilteredContainers(data);
    const route = this.calculateOptimalRoute(
      { lat: data.startLat, lng: data.startLng },
      { lat: data.endLat, lng: data.endLng },
      containers,
    );

    return {
      route,
      totalDistance: this.calculateTotalDistance(route),
      containerCount: containers.length,
      estimatedTime: this.estimateTime(route),
    };
  }

  private async getFilteredContainers(data: OptimizeRouteDto) {
    const cityBounds = this.getCityBounds(data.city);
    let query = this.containerRepository.createQueryBuilder('container')
      .where('container.latitude BETWEEN :minLat AND :maxLat', {
        minLat: cityBounds.minLat,
        maxLat: cityBounds.maxLat,
      })
      .andWhere('container.longitude BETWEEN :minLng AND :maxLng', {
        minLng: cityBounds.minLng,
        maxLng: cityBounds.maxLng,
      });

    if (data.wasteTypes && data.wasteTypes.length > 0) {
      query = query.andWhere('container.wasteLevel IN (:...wasteTypes)', {
        wasteTypes: data.wasteTypes,
      });
    }

    return query.getMany();
  }

  private getCityBounds(city: string) {
    const bounds = {
      'Bogotá D.C., Colombia': {
        minLat: 4.5970, maxLat: 4.7600,
        minLng: -74.1470, maxLng: -74.0470,
      },
      'Madrid, Spain': {
        minLat: 40.3900, maxLat: 40.4700,
        minLng: -3.7500, maxLng: -3.6500,
      },
    };
    return bounds[city] || bounds['Bogotá D.C., Colombia'];
  }

  private calculateOptimalRoute(start: Point, end: Point, containers: Container[]): Point[] {
    if (containers.length === 0) return [start, end];

    // Sort containers by priority: heavy > medium > light
    const prioritizedContainers = containers.sort((a, b) => {
      const priority = { heavy: 3, medium: 2, light: 1 };
      return priority[b.wasteLevel] - priority[a.wasteLevel];
    });

    const points = prioritizedContainers.map(c => ({
      lat: Number(c.latitude),
      lng: Number(c.longitude),
      id: c.id,
      priority: c.wasteLevel === 'heavy' ? 3 : c.wasteLevel === 'medium' ? 2 : 1,
    }));

    // Use Sweep Algorithm optimized for waste collection
    const clusters = this.clusterContainers(points, 0.5);
    const optimizedRoute = this.sweepAlgorithm(start, end, clusters);
    
    return optimizedRoute;
  }

  private findNearest(current: Point, points: Point[]): Point {
    if (points.length === 0) return current;
    return points.reduce((nearest, point) => {
      const currentDist = this.calculateDistance(current, point);
      const nearestDist = this.calculateDistance(current, nearest);
      return currentDist < nearestDist ? point : nearest;
    });
  }

  private findNearestWithPriority(current: Point, points: Point[]): Point {
    if (points.length === 0) return current;
    
    // Find highest priority containers first
    const maxPriority = Math.max(...points.map(p => p.priority || 1));
    const highPriorityPoints = points.filter(p => (p.priority || 1) === maxPriority);
    
    // Among high priority containers, find the nearest
    return highPriorityPoints.reduce((nearest, point) => {
      const currentDist = this.calculateDistance(current, point);
      const nearestDist = this.calculateDistance(current, nearest);
      return currentDist < nearestDist ? point : nearest;
    });
  }

  private clusterContainers(points: Point[], maxDistanceKm: number): Array<{center: Point, containers: Point[]}> {
    const clusters = [];
    const unprocessed = [...points];

    while (unprocessed.length > 0) {
      const seed = unprocessed.shift();
      const cluster = [seed];
      
      // Find all containers within 500m of the seed
      for (let i = unprocessed.length - 1; i >= 0; i--) {
        const distance = this.calculateDistance(seed, unprocessed[i]);
        if (distance <= maxDistanceKm) {
          cluster.push(unprocessed.splice(i, 1)[0]);
        }
      }
      
      // Sort cluster by priority
      cluster.sort((a, b) => (b.priority || 1) - (a.priority || 1));
      
      clusters.push({
        center: seed,
        containers: cluster
      });
    }

    return clusters;
  }

  private findNearestCluster(current: Point, clusters: Array<{center: Point, containers: Point[]}>): {center: Point, containers: Point[]} {
    return clusters.reduce((nearest, cluster) => {
      const currentDist = this.calculateDistance(current, cluster.center);
      const nearestDist = this.calculateDistance(current, nearest.center);
      return currentDist < nearestDist ? cluster : nearest;
    });
  }

  private sweepAlgorithm(start: Point, end: Point, clusters: Array<{center: Point, containers: Point[]}>): Point[] {
    if (clusters.length === 0) return [start, end];

    // Sort clusters by angle from start point (sweep line approach)
    const clustersWithAngle = clusters.map(cluster => ({
      ...cluster,
      angle: Math.atan2(cluster.center.lat - start.lat, cluster.center.lng - start.lng),
      priority: Math.max(...cluster.containers.map(c => c.priority || 1))
    }));

    // Sort by priority first, then by angle for efficient sweep
    clustersWithAngle.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.angle - b.angle;
    });

    const route = [start];
    
    // Visit clusters in sweep order, collecting all containers in each
    clustersWithAngle.forEach(cluster => {
      // Sort containers within cluster by priority and proximity
      const sortedContainers = cluster.containers.sort((a, b) => {
        if ((b.priority || 1) !== (a.priority || 1)) {
          return (b.priority || 1) - (a.priority || 1);
        }
        const lastPoint = route[route.length - 1];
        const distA = this.calculateDistance(lastPoint, a);
        const distB = this.calculateDistance(lastPoint, b);
        return distA - distB;
      });
      
      route.push(...sortedContainers);
    });

    route.push(end);
    return route;
  }

  private calculateDistance(p1: Point, p2: Point): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(p2.lat - p1.lat);
    const dLng = this.toRad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.lat)) * Math.cos(this.toRad(p2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateTotalDistance(route: Point[]): number {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += this.calculateDistance(route[i], route[i + 1]);
    }
    return Math.round(total * 100) / 100;
  }

  private estimateTime(route: Point[]): number {
    const distance = this.calculateTotalDistance(route);
    const avgSpeed = 30; // km/h
    return Math.round((distance / avgSpeed) * 60); // minutes
  }
}