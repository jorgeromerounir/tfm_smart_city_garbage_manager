import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitiesModule } from './cities/cities.module'
import { City } from './cities/city.entity'
import { Container } from './containers/container.entity'
import { ContainersModule } from './containers/containers.module'
import { RoutesModule } from './routes/routes.module'
import { WebsocketModule } from './websocket/websocket.module'

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
