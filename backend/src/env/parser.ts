import { EnvSchema } from "./schema";

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Erro ao validar variáveis de ambiente:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
