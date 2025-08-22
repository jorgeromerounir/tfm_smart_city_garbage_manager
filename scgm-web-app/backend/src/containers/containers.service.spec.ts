import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContainersService } from './containers.service';
import { Container, WasteLevel } from './container.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

describe('ContainersService', () => {
  let service: ContainersService;
  let repository: Repository<Container>;
  let websocketGateway: WebsocketGateway;

  const mockRepository = {
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockWebsocketGateway = {
    emitStatusUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContainersService,
        {
          provide: getRepositoryToken(Container),
          useValue: mockRepository,
        },
        {
          provide: WebsocketGateway,
          useValue: mockWebsocketGateway,
        },
      ],
    }).compile();

    service = module.get<ContainersService>(ContainersService);
    repository = module.get<Repository<Container>>(getRepositoryToken(Container));
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSensorData', () => {
    it('should update container data and emit socket event on level change', async () => {
      const mockContainer = {
        id: 'test-id',
        wasteLevel: WasteLevel.LIGHT,
        temperature: 20,
      };

      const sensorData = {
        containerId: 'test-id',
        wasteLevel: WasteLevel.HEAVY,
        temperature: 25,
      };

      mockRepository.findOne.mockResolvedValue(mockContainer);
      mockRepository.save.mockResolvedValue({
        ...mockContainer,
        wasteLevel: WasteLevel.HEAVY,
        temperature: 25,
      });

      const result = await service.updateSensorData(sensorData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockWebsocketGateway.emitStatusUpdate).toHaveBeenCalled();
      expect(result.wasteLevel).toBe(WasteLevel.HEAVY);
    });

    it('should throw error when container not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const sensorData = {
        containerId: 'non-existent',
        wasteLevel: WasteLevel.HEAVY,
        temperature: 25,
      };

      await expect(service.updateSensorData(sensorData)).rejects.toThrow(
        'Container not found',
      );
    });
  });

  describe('getStatusSummary', () => {
    it('should return correct status counts', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // light
        .mockResolvedValueOnce(50)  // medium
        .mockResolvedValueOnce(30); // heavy

      const result = await service.getStatusSummary();

      expect(result).toEqual({
        light: 100,
        medium: 50,
        heavy: 30,
        total: 180,
      });
    });
  });
});