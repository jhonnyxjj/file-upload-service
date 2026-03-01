import { z } from 'zod';
import { envSchema } from './env.schema';

const parsedEnv = envSchema.safeParse(import.meta.env);


if (!parsedEnv.success) {
  console.error(
    '🔥 Variáveis de ambiente inválidas:',
    z.treeifyError(parsedEnv.error)
  )
  throw new Error('Variáveis de ambiente inválidas.')
}

export const env = {
  apiUrl: parsedEnv.data.VITE_API_URL,
}
