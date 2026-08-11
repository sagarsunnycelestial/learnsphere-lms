import 'reflect-metadata';
import { AppDataSource } from './config/dbConfig.js';
import { envSchema } from './config/env.js';

async function bootstrap() {
  await AppDataSource.initialize();
  const { app } = await import('./app.js');
  app.listen(envSchema.PORT, () => {
    console.log('Server running on PORT: ', envSchema.PORT);
  });
}
bootstrap();
