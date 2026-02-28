import { FastifyRequest, FastifyReply } from 'fastify';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class InternalError extends AppError {
  constructor(message: string) {
    super(message, 500, 'INTERNAL_ERROR');
    this.name = 'InternalError';
  }
}

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
  }

  const statusCode = (error as any).statusCode;

  if (statusCode === 429) {
    return reply.status(429).send({
      error: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Try again later.',
    });
  }

  if (error.name === 'ZodError') {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: error,
    });
  }

  console.error('Unexpected error:', error);
  return reply.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
}
