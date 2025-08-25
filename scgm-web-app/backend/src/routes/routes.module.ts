import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Container } from '../containers/container.entity'
import { RoutesController } from './routes.controller'
import { RoutesService } from './routes.service'

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
