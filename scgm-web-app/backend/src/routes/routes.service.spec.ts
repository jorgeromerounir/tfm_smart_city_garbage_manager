import { Test, type TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Container, WasteLevel } from '../containers/container.entity'
import { Truck } from '../trucks/truck.entity'
import { RouteAssignment } from './route-assignment.entity'
import { RoutesService } from './routes.service'

describe('RoutesService', () => {
  let service: RoutesService
  let containerRepository: Repository<Container>
  let truckRepository: Repository<Truck>
  let assignmentRepository: Repository<RouteAssignment>

  const mockContainerRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  }

  const mockTruckRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  }

  const mockAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: getRepositoryToken(Container),
          useValue: mockContainerRepository,
        },
        {
          provide: getRepositoryToken(Truck),
          useValue: mockTruckRepository,
        },
        {
          provide: getRepositoryToken(RouteAssignment),
          useValue: mockAssignmentRepository,
        },
      ],
    }).compile()

    service = module.get<RoutesService>(RoutesService)
    containerRepository = module.get<Repository<Container>>(getRepositoryToken(Container))
    truckRepository = module.get<Repository<Truck>>(getRepositoryToken(Truck))
    assignmentRepository = module.get<Repository<RouteAssignment>>(getRepositoryToken(RouteAssignment))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('optimizeRoute', () => {
    it('should return optimized route with correct structure', async () => {
      const mockContainers = [
        {
          id: 'container-1',
          latitude: 4.715,
          longitude: -74.075,
          wasteLevel: WasteLevel.HEAVY,
          temperature: 25,
        },
        {
          id: 'container-2',
          latitude: 4.716,
          longitude: -74.076,
          wasteLevel: WasteLevel.MEDIUM,
          temperature: 23,
        },
      ]

      const mockTrucks = [
        { id: 'truck-1', name: 'Truck 1', licensePlate: 'T001', capacity: 5, city: 'Bogotá D.C., Colombia', available: true },
        { id: 'truck-2', name: 'Truck 2', licensePlate: 'T002', capacity: 7, city: 'Bogotá D.C., Colombia', available: true },
      ]

      const queryBuilder = mockContainerRepository.createQueryBuilder()
      queryBuilder.getMany.mockResolvedValue(mockContainers)
      mockTruckRepository.find.mockResolvedValue(mockTrucks)

      const routeData = {
        startLat: 4.711,
        startLng: -74.0721,
        endLat: 4.72,
        endLng: -74.08,
        city: 'Bogotá D.C., Colombia',
        wasteTypes: [WasteLevel.HEAVY, WasteLevel.MEDIUM],
      }

      const result = await service.optimizeRoute(routeData)

      expect(result).toHaveProperty('routes')
      expect(result).toHaveProperty('totalDistance')
      expect(result).toHaveProperty('containerCount')
      expect(result).toHaveProperty('estimatedTime')
      expect(result).toHaveProperty('trucksUsed')
      expect(result.containerCount).toBe(2)
      expect(result.routes).toHaveLength(1) // one truck route
      expect(result.routes[0].points).toHaveLength(4) // start + 2 containers + end
    })

    it('should handle empty container list', async () => {
      const queryBuilder = mockContainerRepository.createQueryBuilder()
      queryBuilder.getMany.mockResolvedValue([])
      mockTruckRepository.find.mockResolvedValue([{ id: 'truck-1', name: 'Truck 1', licensePlate: 'T001', capacity: 5, city: 'Bogotá D.C., Colombia', available: true }])

      const routeData = {
        startLat: 4.711,
        startLng: -74.0721,
        endLat: 4.72,
        endLng: -74.08,
        city: 'Bogotá D.C., Colombia',
      }

      const result = await service.optimizeRoute(routeData)

      expect(result.containerCount).toBe(0)
      expect(result.routes).toHaveLength(0) // no routes for empty containers
    })
  })
})
