import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(pinoHttp({ logger }));

const openApiPath = path.join(process.cwd(), '../docs/openapi.yaml');
try {
  const swaggerDocument = YAML.load(openApiPath);
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch {
  logger.warn('OpenAPI spec not found — Swagger UI disabled');
}

app.use(`/api/${env.API_VERSION}`, apiRateLimiter, routes);

app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`API: http://localhost:${PORT}/api/${env.API_VERSION}`);
  logger.info(`Docs: http://localhost:${PORT}/api/${env.API_VERSION}/docs`);
});

export default app;
