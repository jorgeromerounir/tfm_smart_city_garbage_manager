import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './city.entity';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Post()
  create(@Body() cityData: Partial<City>): Promise<City> {
    return this.citiesService.create(cityData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() cityData: Partial<City>): Promise<City> {
    return this.citiesService.update(id, cityData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.citiesService.remove(id);
  }
}