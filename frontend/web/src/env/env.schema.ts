import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_URL: z.union([
    z.string().url('A URL para o backend é inválida'),
    z.string().startsWith('/'),
  ]),
});
