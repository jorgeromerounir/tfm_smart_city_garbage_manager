import { Injectable, type OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { City } from './city.entity'

@Injectable()
export class CitiesService implements OnModuleInit {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultCities()
  }

  private async seedDefaultCities() {
    const count = await this.citiesRepository.count()
    if (count === 0) {
      const defaultCities = [
        {
          name: 'Bogotá D.C.',
          country: 'Colombia',
          latitude: 4.711,
          longitude: -74.0721,
          active: true,
        },
        {
          name: 'Madrid',
          country: 'Spain',
          latitude: 40.4168,
          longitude: -3.7038,
          active: true,
        },
      ]

      for (const cityData of defaultCities) {
        const city = this.citiesRepository.create(cityData)
        await this.citiesRepository.save(city)
      }
    }
  }

  findAll(): Promise<City[]> {
    return this.citiesRepository.find({
      order: { country: 'ASC', name: 'ASC' },
    })
  }

  create(cityData: Partial<City>): Promise<City> {
    const city = this.citiesRepository.create(cityData)
    return this.citiesRepository.save(city)
  }

  async update(id: number, cityData: Partial<City>): Promise<City> {
    await this.citiesRepository.update(id, cityData)
    return this.citiesRepository.findOne({ where: { id } })
  }

  async remove(id: number): Promise<void> {
    await this.citiesRepository.delete(id)
  }
}
