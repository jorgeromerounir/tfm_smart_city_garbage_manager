import { Injectable, type OnModuleInit } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { WebsocketGateway } from '../websocket/websocket.gateway'
import { Container, WasteLevel } from './container.entity'
import type { SensorDataDto } from './dto/sensor-data.dto'

@Injectable()
export class ContainersService implements OnModuleInit {
  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    private websocketGateway: WebsocketGateway
  ) {}

  async onModuleInit() {
    const count = await this.containerRepository.count()
    if (count === 0) {
      await this.initializeContainers()
    }
  }

  private async initializeContainers() {
    const containers = []
    const streetLocations = {
      bogota: [
        // Carrera 7 (Main Avenue)
        { lat: 4.5981, lng: -74.0758, address: 'Carrera 7 #11-50, Centro' },
        { lat: 4.615, lng: -74.072, address: 'Carrera 7 #26-40, Centro' },
        { lat: 4.635, lng: -74.068, address: 'Carrera 7 #45-20, Chapinero' },
        { lat: 4.655, lng: -74.064, address: 'Carrera 7 #63-15, Zona Rosa' },
        {
          lat: 4.675,
          lng: -74.06,
          address: 'Carrera 7 #85-30, Chapinero Norte'
        },
        // Avenida Caracas
        { lat: 4.61, lng: -74.085, address: 'Av. Caracas #22-10, Santa Fe' },
        { lat: 4.63, lng: -74.082, address: 'Av. Caracas #40-25, Teusaquillo' },
        { lat: 4.65, lng: -74.079, address: 'Av. Caracas #60-15, Chapinero' },
        // Calle 26 (El Dorado)
        { lat: 4.6392, lng: -74.12, address: 'Calle 26 #68-35, Puente Aranda' },
        { lat: 4.6392, lng: -74.1, address: 'Calle 26 #50-20, Teusaquillo' },
        { lat: 4.6392, lng: -74.08, address: 'Calle 26 #30-45, Santa Fe' },
        // Carrera 30 (NQS)
        { lat: 4.62, lng: -74.095, address: 'Carrera 30 #28-60, San Rafael' },
        { lat: 4.64, lng: -74.092, address: 'Carrera 30 #48-30, Galerías' },
        { lat: 4.66, lng: -74.089, address: 'Carrera 30 #68-15, Modelo' },
        // Calle 72
        { lat: 4.6698, lng: -74.0531, address: 'Calle 72 #10-25, Zona Rosa' },
        { lat: 4.6698, lng: -74.0631, address: 'Calle 72 #15-40, Chapinero' },
        // Avenida 68
        { lat: 4.63, lng: -74.11, address: 'Av. 68 #40-20, Engativá' },
        { lat: 4.65, lng: -74.108, address: 'Av. 68 #60-35, Barrios Unidos' },
        // Calle 100
        {
          lat: 4.69,
          lng: -74.055,
          address: 'Calle 100 #11-80, Chapinero Norte'
        },
        {
          lat: 4.69,
          lng: -74.065,
          address: 'Calle 100 #18-45, Chapinero Norte'
        }
      ],
      madrid: [
        // Gran Vía
        { lat: 40.42, lng: -3.71, address: 'Gran Vía, 15, Centro' },
        { lat: 40.421, lng: -3.708, address: 'Gran Vía, 28, Centro' },
        { lat: 40.422, lng: -3.706, address: 'Gran Vía, 42, Centro' },
        // Calle de Alcalá
        { lat: 40.4168, lng: -3.7038, address: 'Calle de Alcalá, 0, Sol' },
        { lat: 40.4153, lng: -3.6944, address: 'Calle de Alcalá, 25, Centro' },
        { lat: 40.4153, lng: -3.6844, address: 'Calle de Alcalá, 42, Retiro' },
        // Paseo de la Castellana
        {
          lat: 40.43,
          lng: -3.695,
          address: 'P. de la Castellana, 15, Salamanca'
        },
        {
          lat: 40.44,
          lng: -3.692,
          address: 'P. de la Castellana, 45, Chamartín'
        },
        {
          lat: 40.45,
          lng: -3.689,
          address: 'P. de la Castellana, 75, Chamartín'
        },
        // Calle de Serrano
        {
          lat: 40.425,
          lng: -3.685,
          address: 'Calle de Serrano, 25, Salamanca'
        },
        { lat: 40.43, lng: -3.683, address: 'Calle de Serrano, 45, Salamanca' },
        {
          lat: 40.435,
          lng: -3.681,
          address: 'Calle de Serrano, 65, Salamanca'
        },
        // Paseo del Prado
        { lat: 40.408, lng: -3.692, address: 'Paseo del Prado, 8, Cortes' },
        { lat: 40.41, lng: -3.691, address: 'Paseo del Prado, 18, Cortes' },
        // Calle de Atocha
        { lat: 40.41, lng: -3.7, address: 'Calle de Atocha, 45, Lavapiés' },
        { lat: 40.408, lng: -3.695, address: 'Calle de Atocha, 75, Cortes' },
        // Calle Mayor
        { lat: 40.4155, lng: -3.7074, address: 'Calle Mayor, 15, Centro' },
        { lat: 40.416, lng: -3.71, address: 'Calle Mayor, 35, Centro' },
        // Calle de Fuencarral
        {
          lat: 40.425,
          lng: -3.708,
          address: 'Calle de Fuencarral, 25, Malasaña'
        },
        {
          lat: 40.428,
          lng: -3.707,
          address: 'Calle de Fuencarral, 45, Malasaña'
        }
      ]
    }

    for (let i = 0; i < 200; i++) {
      const isBogota = i % 2 === 0
      const locations = isBogota
        ? streetLocations.bogota
        : streetLocations.madrid
      const location = locations[i % locations.length]

      const container = this.containerRepository.create({
        latitude: location.lat + (Math.random() - 0.5) * 0.001, // Small variation for nearby streets
        longitude: location.lng + (Math.random() - 0.5) * 0.001,
        wasteLevel: Object.values(WasteLevel)[Math.floor(Math.random() * 3)],
        temperature: Math.round((Math.random() * 40 + 10) * 100) / 100,
        address: location.address,
        city: isBogota ? 'Bogotá D.C., Colombia' : 'Madrid, Spain'
      })
      containers.push(container)
    }

    await this.containerRepository.save(containers)
    console.log('Initialized 200 containers at accessible street locations')
  }

  async updateSensorData(data: SensorDataDto) {
    const container = await this.containerRepository.findOne({
      where: { id: data.containerId }
    })

    if (!container) {
      throw new Error('Container not found')
    }

    const oldLevel = container.wasteLevel
    container.wasteLevel = data.wasteLevel
    container.temperature = data.temperature

    await this.containerRepository.save(container)

    if (oldLevel !== data.wasteLevel) {
      this.websocketGateway.emitStatusUpdate(container)
    }

    return container
  }

  async getAllContainers(city?: string) {
    if (city) {
      return this.containerRepository.find({ where: { city } })
    }
    return this.containerRepository.find()
  }

  async getContainersByCity(city: string) {
    return this.containerRepository.find({ where: { city } })
  }

  async getStatusSummary(city?: string) {
    const whereClause = city ? { city } : {}
    const [light, medium, heavy] = await Promise.all([
      this.containerRepository.count({
        where: { ...whereClause, wasteLevel: WasteLevel.LIGHT }
      }),
      this.containerRepository.count({
        where: { ...whereClause, wasteLevel: WasteLevel.MEDIUM }
      }),
      this.containerRepository.count({
        where: { ...whereClause, wasteLevel: WasteLevel.HEAVY }
      })
    ])

    return { light, medium, heavy, total: light + medium + heavy }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateContainerStatuses() {
    const containers = await this.containerRepository.find()
    const updates = []

    for (const container of containers) {
      if (Math.random() < 0.1) {
        const oldLevel = container.wasteLevel
        container.wasteLevel =
          Object.values(WasteLevel)[Math.floor(Math.random() * 3)]
        container.temperature =
          Math.round((Math.random() * 40 + 10) * 100) / 100

        updates.push(container)

        if (oldLevel !== container.wasteLevel) {
          this.websocketGateway.emitStatusUpdate(container)
        }
      }
    }

    if (updates.length > 0) {
      await this.containerRepository.save(updates)
      console.log(`Updated ${updates.length} containers`)
    }
  }
}
