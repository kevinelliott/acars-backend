import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@WebSocketGateway({ origins: '*:*', transports: ['polling', 'websocket'] })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(EventsGateway.name);
  connectionsCount: number = 0;
  connections: Map<string, any> = new Map();

  async afterInit() {
    this.logger.log('WebSocketGateway initialized.');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectionsCount++;
    this.connections[client.id] = client;
    this.logger.log('Browser connected.');
    this.server.emit('clients', this.connections);
    this.server.emit('events', 'browser-connected');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectionsCount--;
    this.connections.delete(client.id);
    this.logger.log('Browser disconnected.');
    this.server.emit('clients', this.connections);
    this.server.emit('events', 'browser-disconnected');
  }

  async broadcast(subject: string, data: any) {
    if (this.connectionsCount > 0) {
      this.logger.log("Broadcasting '" + subject + "' to " + this.connectionsCount + " browsers.");
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

  // @SubscribeMessage('events')
  // handleEvents(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }
}
