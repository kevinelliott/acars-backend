import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { RavenModule } from 'nest-raven';
import { StatusMonitorModule } from 'nest-status-monitor';

import { configService } from './config/config.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminStatsModule } from './admin/stats/admin_stats.module';
import { AirframesModule } from './airframes/airframes.module';
import { EventsModule } from './events/events.module';
import { FlightsModule } from './flights/flights.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MessagesModule } from './messages/messages.module';
import { NatsModule } from './nats/nats.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';

const statusMonitorConfig = {
  pageTitle: 'Nest.js Monitoring Page',
  port: 443,
  path: '/status',
  ignoreStartsWith: '/health/alive',
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    }
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: []
}
@Module({
  imports: [
    MorganModule.forRoot(),
    StatusMonitorModule.setUp(statusMonitorConfig),
    AdminStatsModule,
    AirframesModule,
    EventsModule,
    FlightsModule,
    LeaderboardModule,
    MessagesModule,
    NatsModule,
    RavenModule,
    ScheduleModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    TypeOrmModule.forRoot(configService.getDefaultDbConfig()),
    TypeOrmModule.forRoot(configService.getReadOnlyDbConfig()),
    UsersModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    }
  ],
})
export class AppModule {
  constructor(
    private readonly connection: Connection,
    private readonly readOnlyConnection: Connection
  ) {}
}
