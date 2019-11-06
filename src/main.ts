import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { configService } from './config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  let app;

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    const keyFile  = fs.readFileSync('/certs/api.airframes.io-key.pem');
    const certFile = fs.readFileSync('/certs/api.airframes.io-cert.pem');
    app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
      }
    });
  } else {
    app = await NestFactory.create(AppModule, {});
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

  const allowedOrigins = "*:*"
  const corsOptions = {
    "origins": allowedOrigins,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
  }
  app.enableCors(corsOptions);

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    await app.listen(443);
  } else {
    await app.listen(3001);
  }
}
bootstrap();
