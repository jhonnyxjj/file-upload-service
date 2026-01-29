import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { uploadImageRoute } from './http/routes';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyRateLimit } from '@fastify/rate-limit'

const server = fastify();
const rateLimitOptions = {
  max: 300,
  timeWindow: '5 minute'
};

server.register(fastifyCors, {
  origin: '*',
});
server.register(fastifyMultipart);

server.register(fastifyRateLimit, rateLimitOptions);
server.register(uploadImageRoute);

server.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!');
})