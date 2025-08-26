import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import { ContainersService } from './containers.service'
import type { SensorDataDto } from './dto/sensor-data.dto'

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post('data')
  async receiveSensorData(@Body() data: SensorDataDto) {
    try {
      const container = await this.containersService.updateSensorData(data)
      return { success: true, container }
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get()
  async getAllContainers(@Query('city') city?: string) {
    return this.containersService.getAllContainers(city)
  }

  @Get('status')
  async getStatusSummary(@Query('city') city?: string) {
    return this.containersService.getStatusSummary(city)
  }
}
