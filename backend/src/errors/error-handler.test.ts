import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { 
  AppError, 
  BadRequestError, 
  NotFoundError, 
  errorHandler 
} from '../errors';

describe('Error Handler', () => {
  let mockReply: Partial<FastifyReply>;
  let mockRequest: Partial<FastifyRequest>;

  beforeEach(() => {
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    mockRequest = {
      log: {
        error: vi.fn(),
      } as any,
    };
  });

  it('should handle AppError with correct status code', () => {
    const error = new BadRequestError('Invalid input');

    errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'BAD_REQUEST',
      message: 'Invalid input',
    });
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('Resource not found');

    errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'NOT_FOUND',
      message: 'Resource not found',
    });
  });

  it('should handle unknown errors as internal server error', () => {
    const error = new Error('Unknown error');

    errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  });

  it('should log error before sending response', () => {
    const error = new AppError('Test error', 500);

    errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockRequest.log?.error).toHaveBeenCalledWith(error);
  });
});
