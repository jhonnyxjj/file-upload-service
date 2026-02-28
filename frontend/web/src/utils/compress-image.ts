export type CompressionLevel = 'low' | 'medium' | 'high'

export function compressImage(
  file: File,
  _level: CompressionLevel = 'medium',
): Promise<File> {
  // Backend agora faz a compressão com Sharp
  // Retorna o arquivo original sem compressão
  return Promise.resolve(file);
}
