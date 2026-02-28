import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { uploadImageRoute, healthRoute } from './http/routes';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyRateLimit } from '@fastify/rate-limit';
import { errorHandler } from './errors';

const server = fastify({
  logger: true,
});

const port = Number(process.env.PORT) || 3000;

server.register(fastifyCors, {
  origin: '*',
});

server.register(fastifyMultipart);
server.register(fastifyRateLimit, {
  max: 300,
  timeWindow: '5 minute'
});

server.setErrorHandler(errorHandler);

server.register(healthRoute);
server.register(uploadImageRoute);

server.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on port ${port}!`);
});