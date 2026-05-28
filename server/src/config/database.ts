import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

/**
 * Singleton Prisma client instance.
 */
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? [{ emit: 'event', level: 'query' }]
      : ['error', 'warn'],
});

prisma.$connect()
  .then(() => logger.info('Database connected'))
  .catch((err: Error) => {
    logger.error(
      { err: err.message },
      'Database connection failed — run: docker compose up -d && npm run db:migrate'
    );
  });
