import type { FastifyInstance } from 'fastify';
import { HealthCheckService } from '@/health';
import { makeR2StorageAdapter } from '@/factories/create-r2-storage.factory';

export async function healthRoute(fastify: FastifyInstance) {
  const healthService = new HealthCheckService(makeR2StorageAdapter());

  fastify.get('/health', async (request, reply) => {
    const health = await healthService.check();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    return reply.status(statusCode).send(health);
  });
}
