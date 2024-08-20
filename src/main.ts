import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModuleLocal } from './swagger/swagger.module';
import { InternalExceptionsFilter } from '@filters/internal-exceptions.filter';
import { GlobalLogger } from '@interceptors/globalLogger.interceptor';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.API_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: "Set-cookie"
  })
  app.setGlobalPrefix("api")
  app.useGlobalFilters(new InternalExceptionsFilter())
  app.useGlobalInterceptors(new GlobalLogger())
  app.use(cookieParser())

  SwaggerModuleLocal.forRoot(app)

  await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();
