import 'reflect-metadata';
import { AppDataSource } from './config/dbConfig.js';
import { envSchema } from './config/env.js';
import { logger } from './config/logger.js';

async function bootstrap() {
  await AppDataSource.initialize();
  const { app } = await import('./app.js');
  app.listen(envSchema.PORT, () => {
    logger.info(`Server running on PORT: ${envSchema.PORT} `);
  });
}
bootstrap();
