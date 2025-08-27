import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Container } from '../containers/container.entity'
import { Truck } from '../trucks/truck.entity'
import { RouteAssignment } from './route-assignment.entity'
import { RoutesController } from './routes.controller'
import { RoutesService } from './routes.service'

@Module({
  imports: [TypeOrmModule.forFeature([Container, Truck, RouteAssignment])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
