import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TerminusModule } from '@nestjs/terminus';
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';

import { configService } from './config/config.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminGeoJsonModule } from './admin/geojson/admin_geo_json.module';
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
import { MailReportService } from './mail_report.service';
import { StationsModule } from './stations/stations.module';

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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true,
        auth: {
          user: 'apikey',
          pass: configService.getSendGridApiKey(),
        }
      },
      defaults: {
        from: '"Airframes" <no-reply@airframes.io>',
      },
      preview: false,
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AdminGeoJsonModule,
    AdminStatsModule,
    AirframesModule,
    EventsModule,
    FlightsModule,
    LeaderboardModule,
    MessagesModule,
    NatsModule,
    ScheduleModule,
    StationsModule,
    TypeOrmModule.forRoot(configService.getDefaultDbConfig()),
    TypeOrmModule.forRoot(configService.getReadOnlyDbConfig()),
    UsersModule,
    UserModule,
    UserStationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    MailReportService,
  ],
})
export class AppModule {
  constructor(
    private readonly connection: Connection,
    private readonly readOnlyConnection: Connection
  ) {}
}
