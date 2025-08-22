import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ContainersModule } from './containers/containers.module';
import { RoutesModule } from './routes/routes.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CitiesModule } from './cities/cities.module';
import { Container } from './containers/container.entity';
import { City } from './cities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'uwm.db',
      entities: [Container, City],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    ContainersModule,
    RoutesModule,
    WebsocketModule,
    CitiesModule,
  ],
})
export class AppModule {}