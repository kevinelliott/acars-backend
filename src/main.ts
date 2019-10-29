import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { configService } from './config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const allowedOrigins = "https://app.airframes.io:* https://acars-frontend.onrender.com:* http://127.0.0.1:*"
  const corsOptions = {
    "origins": allowedOrigins,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials":true
  }
  app.enableCors(corsOptions);

  await app.listen(3001);
}
bootstrap();
