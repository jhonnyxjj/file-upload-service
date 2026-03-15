import type { IStorageR2 } from "../infra/r2/contracts";

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    storage: {
      status: 'up' | 'down';
      name: string;
    };
  };
  environment: string;
}

export class HealthCheckService {
  constructor(private readonly storage: IStorageR2) { }

  async check(): Promise<HealthStatus> {
    const storageHealthy = await this.storage.healthCheck();

    const isHealthy = storageHealthy;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        storage: {
          status: storageHealthy ? 'up' : 'down',
          name: 'Cloudflare R2',
        },
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
