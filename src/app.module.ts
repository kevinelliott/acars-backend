import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { RavenModule } from 'nest-raven';
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';

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
import { UserStationsModule } from './user/stations/stations.module';

import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    OgmaModule.forRoot({
      service: {
        color: true,
        json: false,
        application: 'Airframes'
      },
      interceptor: {
        http: ExpressParser,
        ws: false,
        gql: false,
        rpc: false
      }
    }),
    AuthModule,
    TerminusModule,
    AdminStatsModule,
    AirframesModule,
    EventsModule,
    FlightsModule,
    LeaderboardModule,
    MessagesModule,
    NatsModule,
    RavenModule,
    ScheduleModule,
    TypeOrmModule.forRoot(configService.getDefaultDbConfig()),
    TypeOrmModule.forRoot(configService.getReadOnlyDbConfig()),
    UsersModule,
    UserModule,
    UserStationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  constructor(
    private readonly connection: Connection,
    private readonly readOnlyConnection: Connection
  ) {}
}
