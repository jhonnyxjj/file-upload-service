import { z, ZodError } from 'zod';
import { zodErrorToString } from './zod-error-to-string';

export function validateRequestInput<T extends z.ZodTypeAny>(schema: T, data: unknown,): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(zodErrorToString(result.error as ZodError));
  }
  return result.data;
}