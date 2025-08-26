import { Body, Controller, Post } from '@nestjs/common'
import type { OptimizeRouteDto } from './dto/optimize-route.dto'
import { RoutesService } from './routes.service'

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('optimize')
  async optimizeRoute(@Body() data: OptimizeRouteDto) {
    return this.routesService.optimizeRoute(data)
  }
}
