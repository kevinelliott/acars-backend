import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const eventsMicroservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  const natsMicroservice = app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222',
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
