import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WebsocketModule } from '../websocket/websocket.module'
import { Container } from './container.entity'
import { ContainersController } from './containers.controller'
import { ContainersService } from './containers.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Container]),
    forwardRef(() => WebsocketModule)
  ],
  controllers: [ContainersController],
  providers: [ContainersService],
  exports: [ContainersService]
})
export class ContainersModule {
}
