import { Readable } from 'node:stream';

export type CompressionLevel = 'low' | 'medium' | 'high';

export interface CompressedImage {
  path: string;
  contentType: string;
  stream: Readable;
  originalSize: number;
  compressedSize: number;
}

export interface ImageCompressor {
  compress(
    input: {
      path: string;
      contentType: string;
      stream: Readable;
    },
    level?: CompressionLevel
  ): Promise<CompressedImage>;
}

export interface CompressOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}
