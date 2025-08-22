import { Controller, Post, Body } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { OptimizeRouteDto } from './dto/optimize-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('optimize')
  async optimizeRoute(@Body() data: OptimizeRouteDto) {
    return this.routesService.optimizeRoute(data);
  }
}