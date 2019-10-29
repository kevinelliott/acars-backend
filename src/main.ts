import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { EasyconfigService } from 'nestjs-easyconfig';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EasyconfigService);

  const eventsMicroservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  const natsMicroservice = app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      url: configService.get('NATS_URL'),
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
