import { z } from "zod";

export const GetImageInputSchema = z.object({
  path: z.string().min(1, "O caminho do arquivo é obrigatório"),
});

export const GetImageOutputSchema = z.object({
  stream: z.custom<NodeJS.ReadableStream>((val) => {
    // Verifica se o objeto possui o método pipe, característico de streams
    return val && typeof (val as any).pipe === "function";
  }, "O retorno deve ser um stream válido"),
  contentType: z.string().startsWith("image/", "O tipo de conteúdo deve ser uma imagem"),
});

// Extração dos tipos a partir dos schemas (Substituindo suas interfaces manuais)
export type GetImageInputDTO = z.infer<typeof GetImageInputSchema>;
export type GetImageOutputDTO = z.infer<typeof GetImageOutputSchema>;