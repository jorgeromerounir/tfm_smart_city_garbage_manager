import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import type { OptimizeRouteDto } from './dto/optimize-route.dto'
import { RoutesService } from './routes.service'
import { AssignmentStatus } from './route-assignment.entity'

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('optimize')
  async optimizeRoute(@Body() data: OptimizeRouteDto) {
    return this.routesService.optimizeRoute(data)
  }

  @Post('assign')
  async assignRoute(@Body() data: {
    routeName: string
    routeData: any
    truckId: string
    operatorId: string
    supervisorId: string
    city: string
  }) {
    return this.routesService.assignRoute(data)
  }

  @Get('assignments')
  async getAssignments(@Query('operatorId') operatorId?: string) {
    return this.routesService.getAssignments(operatorId)
  }

  @Put('assignments/:id/status')
  async updateAssignmentStatus(
    @Param('id') id: string,
    @Body() data: { status: AssignmentStatus }
  ) {
    return this.routesService.updateAssignmentStatus(id, data.status)
  }

  @Get('trucks')
  async getTrucks(@Query('city') city?: string) {
    return this.routesService.getTrucks(city)
  }

  @Post('trucks')
  async createTruck(@Body() data: {
    name: string
    licensePlate: string
    capacity: number
    city: string
  }) {
    return this.routesService.createTruck(data)
  }
}
