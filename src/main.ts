import * as LogRocket from 'logrocket';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { configService } from './config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  let app;

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    LogRocket.init('6n9b7u/acars');

    const keyFile  = fs.readFileSync('/certs/api.airframes.io-key.pem');
    const certFile = fs.readFileSync('/certs/api.airframes.io-cert.pem');
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        httpsOptions: {
          key: keyFile,
          cert: certFile,
        }
      }
    );
  } else {
    LogRocket.init('6n9b7u/acars-dev');
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {}
    );
  }

  const eventsMicroservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  const natsMicroservice = app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      url: configService.getNatsConfig().natsUrl,
    },
  });

  await app.startAllMicroservicesAsync();

  const corsOptions = {
    "origin": ['https://app.airframes.io', /.*$/, 'http://localhost'],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
  }
  app.enableCors(corsOptions);

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    await app.listen(443, '0.0.0.0');
  } else {
    await app.listen(3001, '0.0.0.0');
  }
}
bootstrap();
