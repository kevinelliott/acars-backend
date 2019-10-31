import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@WebSocketGateway({ origins: '*:*', transports: ['polling', 'websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(EventsGateway.name);
  connections: number = 0;
  clients: Map<string, any> = new Map();

  async handleConnection(client: any) {
    this.connections++;
    this.clients[client.id] = client;
    this.logger.log('Browser connected.');
    this.server.emit('events', 'browser-connected');
  }

  async handleDisconnect(client) {
    this.connections--;
    this.clients.delete(client.id);
    this.logger.log('Browser disconnected.');
    this.server.emit('events', 'browser-disconnected');
  }

  async broadcast(subject: string, data: any) {
    if (this.connections > 0) {
      this.logger.log("Broadcasting '" + subject + "' to " + this.connections + " browsers.");
      try {
        this.server.emit('events', 'broadcast');
        this.server.emit(subject, data);  
      } catch (e) {
        this.logger.log(e);
      }
    } else {
      this.logger.log('No browser connections, skipping broadcast.')
    }
  }

  @SubscribeMessage('events')
  handleEvents(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
