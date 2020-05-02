import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { RavenModule } from 'nest-raven';

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
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    MorganModule.forRoot(),
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
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    TypeOrmModule.forRoot(configService.getDefaultDbConfig()),
    TypeOrmModule.forRoot(configService.getReadOnlyDbConfig()),
    UsersModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
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
