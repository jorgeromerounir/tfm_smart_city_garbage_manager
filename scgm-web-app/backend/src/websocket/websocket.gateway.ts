import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Container } from '../containers/container.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  emitStatusUpdate(container: Container) {
    this.server.emit('containerStatusUpdate', {
      id: container.id,
      wasteLevel: container.wasteLevel,
      temperature: container.temperature,
      latitude: container.latitude,
      longitude: container.longitude,
      updatedAt: container.updatedAt,
    });
  }

  emitRouteUpdate(route: any) {
    this.server.emit('routeUpdate', route);
  }
}