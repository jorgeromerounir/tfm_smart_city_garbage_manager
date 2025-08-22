import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutesService } from './routes.service';
import { Container, WasteLevel } from '../containers/container.entity';

describe('RoutesService', () => {
  let service: RoutesService;
  let repository: Repository<Container>;

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: getRepositoryToken(Container),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    repository = module.get<Repository<Container>>(getRepositoryToken(Container));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('optimizeRoute', () => {
    it('should return optimized route with correct structure', async () => {
      const mockContainers = [
        {
          id: 'container-1',
          latitude: 4.7150,
          longitude: -74.0750,
          wasteLevel: WasteLevel.HEAVY,
          temperature: 25,
        },
        {
          id: 'container-2',
          latitude: 4.7160,
          longitude: -74.0760,
          wasteLevel: WasteLevel.MEDIUM,
          temperature: 23,
        },
      ];

      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockContainers);

      const routeData = {
        startLat: 4.7110,
        startLng: -74.0721,
        endLat: 4.7200,
        endLng: -74.0800,
        city: 'Bogotá D.C., Colombia',
        wasteTypes: [WasteLevel.HEAVY, WasteLevel.MEDIUM],
      };

      const result = await service.optimizeRoute(routeData);

      expect(result).toHaveProperty('route');
      expect(result).toHaveProperty('totalDistance');
      expect(result).toHaveProperty('containerCount');
      expect(result).toHaveProperty('estimatedTime');
      expect(result.containerCount).toBe(2);
      expect(result.route).toHaveLength(4); // start + 2 containers + end
    });

    it('should handle empty container list', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue([]);

      const routeData = {
        startLat: 4.7110,
        startLng: -74.0721,
        endLat: 4.7200,
        endLng: -74.0800,
        city: 'Bogotá D.C., Colombia',
      };

      const result = await service.optimizeRoute(routeData);

      expect(result.containerCount).toBe(0);
      expect(result.route).toHaveLength(2); // only start and end
    });
  });
});