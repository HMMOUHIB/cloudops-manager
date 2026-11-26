import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration (.env)
  const config = app.get(ConfigService);
  const port = Number(config.get('API_PORT', 4000));
  const frontendURL = config.getOrThrow<string>('FRONTEND_URL');

  // HTTP setup
  app.setGlobalPrefix('api');
  app.enableCors({ origin: frontendURL });

  // Start server
  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}/api`, 'Bootstrap');
}
bootstrap();
