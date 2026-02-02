import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { uploadImageRoute } from './http/routes';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyRateLimit } from '@fastify/rate-limit';

const server = fastify();

const port = Number(process.env.PORT) || 3000;

server.register(fastifyCors, {
  origin: '*', // 
});

server.register(fastifyMultipart);
server.register(fastifyRateLimit, {
  max: 300,
  timeWindow: '5 minute'
});

server.register(uploadImageRoute);

// O host '0.0.0.0' é usado para Docker em nuvem
server.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on port ${port}!`);
});