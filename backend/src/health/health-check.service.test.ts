import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthCheckService } from '../health';
import { IStorageR2 } from '../infra/r2/contracts';

describe('HealthCheckService', () => {
  let healthService: HealthCheckService;
  let mockStorage: IStorageR2;

  beforeEach(() => {
    mockStorage = {
      uploadStream: vi.fn(),
      downloadStream: vi.fn(),
      healthCheck: vi.fn(),
    };
    healthService = new HealthCheckService(mockStorage);
  });

  it('should return healthy when storage is up', async () => {
    vi.mocked(mockStorage.healthCheck).mockResolvedValue(true);

    const result = await healthService.check();

    expect(result.status).toBe('healthy');
    expect(result.services.storage.status).toBe('up');
  });

  it('should return unhealthy when storage is down', async () => {
    vi.mocked(mockStorage.healthCheck).mockResolvedValue(false);

    const result = await healthService.check();

    expect(result.status).toBe('unhealthy');
    expect(result.services.storage.status).toBe('down');
  });

  it('should include timestamp in response', async () => {
    vi.mocked(mockStorage.healthCheck).mockResolvedValue(true);

    const result = await healthService.check();

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
  });
});
