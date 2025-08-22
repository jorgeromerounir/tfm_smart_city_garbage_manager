import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Container, WasteLevel } from './container.entity';
import { SensorDataDto } from './dto/sensor-data.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ContainersService implements OnModuleInit {
  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async onModuleInit() {
    const count = await this.containerRepository.count();
    if (count === 0) {
      await this.initializeContainers();
    }
  }

  private async initializeContainers() {
    const containers = [];
    const streetLocations = {
      bogota: [
        // Carrera 7 (Main Avenue)
        { lat: 4.5981, lng: -74.0758, address: 'Carrera 7 #11-50, Centro' },
        { lat: 4.6150, lng: -74.0720, address: 'Carrera 7 #26-40, Centro' },
        { lat: 4.6350, lng: -74.0680, address: 'Carrera 7 #45-20, Chapinero' },
        { lat: 4.6550, lng: -74.0640, address: 'Carrera 7 #63-15, Zona Rosa' },
        { lat: 4.6750, lng: -74.0600, address: 'Carrera 7 #85-30, Chapinero Norte' },
        // Avenida Caracas
        { lat: 4.6100, lng: -74.0850, address: 'Av. Caracas #22-10, Santa Fe' },
        { lat: 4.6300, lng: -74.0820, address: 'Av. Caracas #40-25, Teusaquillo' },
        { lat: 4.6500, lng: -74.0790, address: 'Av. Caracas #60-15, Chapinero' },
        // Calle 26 (El Dorado)
        { lat: 4.6392, lng: -74.1200, address: 'Calle 26 #68-35, Puente Aranda' },
        { lat: 4.6392, lng: -74.1000, address: 'Calle 26 #50-20, Teusaquillo' },
        { lat: 4.6392, lng: -74.0800, address: 'Calle 26 #30-45, Santa Fe' },
        // Carrera 30 (NQS)
        { lat: 4.6200, lng: -74.0950, address: 'Carrera 30 #28-60, San Rafael' },
        { lat: 4.6400, lng: -74.0920, address: 'Carrera 30 #48-30, Galerías' },
        { lat: 4.6600, lng: -74.0890, address: 'Carrera 30 #68-15, Modelo' },
        // Calle 72
        { lat: 4.6698, lng: -74.0531, address: 'Calle 72 #10-25, Zona Rosa' },
        { lat: 4.6698, lng: -74.0631, address: 'Calle 72 #15-40, Chapinero' },
        // Avenida 68
        { lat: 4.6300, lng: -74.1100, address: 'Av. 68 #40-20, Engativá' },
        { lat: 4.6500, lng: -74.1080, address: 'Av. 68 #60-35, Barrios Unidos' },
        // Calle 100
        { lat: 4.6900, lng: -74.0550, address: 'Calle 100 #11-80, Chapinero Norte' },
        { lat: 4.6900, lng: -74.0650, address: 'Calle 100 #18-45, Chapinero Norte' },
      ],
      madrid: [
        // Gran Vía
        { lat: 40.4200, lng: -3.7100, address: 'Gran Vía, 15, Centro' },
        { lat: 40.4210, lng: -3.7080, address: 'Gran Vía, 28, Centro' },
        { lat: 40.4220, lng: -3.7060, address: 'Gran Vía, 42, Centro' },
        // Calle de Alcalá
        { lat: 40.4168, lng: -3.7038, address: 'Calle de Alcalá, 0, Sol' },
        { lat: 40.4153, lng: -3.6944, address: 'Calle de Alcalá, 25, Centro' },
        { lat: 40.4153, lng: -3.6844, address: 'Calle de Alcalá, 42, Retiro' },
        // Paseo de la Castellana
        { lat: 40.4300, lng: -3.6950, address: 'P. de la Castellana, 15, Salamanca' },
        { lat: 40.4400, lng: -3.6920, address: 'P. de la Castellana, 45, Chamartín' },
        { lat: 40.4500, lng: -3.6890, address: 'P. de la Castellana, 75, Chamartín' },
        // Calle de Serrano
        { lat: 40.4250, lng: -3.6850, address: 'Calle de Serrano, 25, Salamanca' },
        { lat: 40.4300, lng: -3.6830, address: 'Calle de Serrano, 45, Salamanca' },
        { lat: 40.4350, lng: -3.6810, address: 'Calle de Serrano, 65, Salamanca' },
        // Paseo del Prado
        { lat: 40.4080, lng: -3.6920, address: 'Paseo del Prado, 8, Cortes' },
        { lat: 40.4100, lng: -3.6910, address: 'Paseo del Prado, 18, Cortes' },
        // Calle de Atocha
        { lat: 40.4100, lng: -3.7000, address: 'Calle de Atocha, 45, Lavapiés' },
        { lat: 40.4080, lng: -3.6950, address: 'Calle de Atocha, 75, Cortes' },
        // Calle Mayor
        { lat: 40.4155, lng: -3.7074, address: 'Calle Mayor, 15, Centro' },
        { lat: 40.4160, lng: -3.7100, address: 'Calle Mayor, 35, Centro' },
        // Calle de Fuencarral
        { lat: 40.4250, lng: -3.7080, address: 'Calle de Fuencarral, 25, Malasaña' },
        { lat: 40.4280, lng: -3.7070, address: 'Calle de Fuencarral, 45, Malasaña' },
      ]
    };

    for (let i = 0; i < 200; i++) {
      const isBogota = i % 2 === 0;
      const locations = isBogota ? streetLocations.bogota : streetLocations.madrid;
      const location = locations[i % locations.length];
      
      const container = this.containerRepository.create({
        latitude: location.lat + (Math.random() - 0.5) * 0.001, // Small variation for nearby streets
        longitude: location.lng + (Math.random() - 0.5) * 0.001,
        wasteLevel: Object.values(WasteLevel)[Math.floor(Math.random() * 3)],
        temperature: Math.round((Math.random() * 40 + 10) * 100) / 100,
        address: location.address,
        city: isBogota ? 'Bogotá D.C., Colombia' : 'Madrid, Spain',
      });
      containers.push(container);
    }

    await this.containerRepository.save(containers);
    console.log('Initialized 200 containers at accessible street locations');
  }

  async updateSensorData(data: SensorDataDto) {
    const container = await this.containerRepository.findOne({
      where: { id: data.containerId },
    });

    if (!container) {
      throw new Error('Container not found');
    }

    const oldLevel = container.wasteLevel;
    container.wasteLevel = data.wasteLevel;
    container.temperature = data.temperature;

    await this.containerRepository.save(container);

    if (oldLevel !== data.wasteLevel) {
      this.websocketGateway.emitStatusUpdate(container);
    }

    return container;
  }

  async getAllContainers(city?: string) {
    if (city) {
      return this.containerRepository.find({ where: { city } });
    }
    return this.containerRepository.find();
  }

  async getContainersByCity(city: string) {
    return this.containerRepository.find({ where: { city } });
  }

  async getStatusSummary(city?: string) {
    const whereClause = city ? { city } : {};
    const [light, medium, heavy] = await Promise.all([
      this.containerRepository.count({ where: { ...whereClause, wasteLevel: WasteLevel.LIGHT } }),
      this.containerRepository.count({ where: { ...whereClause, wasteLevel: WasteLevel.MEDIUM } }),
      this.containerRepository.count({ where: { ...whereClause, wasteLevel: WasteLevel.HEAVY } }),
    ]);

    return { light, medium, heavy, total: light + medium + heavy };
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateContainerStatuses() {
    const containers = await this.containerRepository.find();
    const updates = [];

    for (const container of containers) {
      if (Math.random() < 0.1) {
        const oldLevel = container.wasteLevel;
        container.wasteLevel = Object.values(WasteLevel)[Math.floor(Math.random() * 3)];
        container.temperature = Math.round((Math.random() * 40 + 10) * 100) / 100;
        
        updates.push(container);
        
        if (oldLevel !== container.wasteLevel) {
          this.websocketGateway.emitStatusUpdate(container);
        }
      }
    }

    if (updates.length > 0) {
      await this.containerRepository.save(updates);
      console.log(`Updated ${updates.length} containers`);
    }
  }
}