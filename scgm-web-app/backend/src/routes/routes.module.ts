import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { Container } from '../containers/container.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}