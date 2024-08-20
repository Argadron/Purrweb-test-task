import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })

  await app.listen(3000);
}
bootstrap();
