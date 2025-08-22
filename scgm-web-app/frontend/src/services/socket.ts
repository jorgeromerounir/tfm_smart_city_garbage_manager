import { io, Socket } from 'socket.io-client';
import { Container } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:3001');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onContainerUpdate(callback: (container: Container) => void) {
    if (this.socket) {
      this.socket.on('containerStatusUpdate', callback);
    }
  }

  onRouteUpdate(callback: (route: any) => void) {
    if (this.socket) {
      this.socket.on('routeUpdate', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();