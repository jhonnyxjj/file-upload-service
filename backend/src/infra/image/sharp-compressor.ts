import sharp from 'sharp';
import { Readable } from 'node:stream';
import { ImageCompressor, CompressedImage, CompressionLevel } from './contracts';

const COMPRESSION_LEVELS: Record<CompressionLevel, { quality: number; maxWidth: number; maxHeight: number }> = {
  low: { quality: 95, maxWidth: 4096, maxHeight: 4096 },
  medium: { quality: 80, maxWidth: 2048, maxHeight: 2048 },
  high: { quality: 65, maxWidth: 1920, maxHeight: 1080 },
};

export class SharpCompressor implements ImageCompressor {
  async compress(
    input: {
      path: string;
      contentType: string;
      stream: Readable;
    },
    level: CompressionLevel = 'medium'
  ): Promise<CompressedImage> {
    const opts = COMPRESSION_LEVELS[level];

    // Collect all chunks from stream
    const chunks: Buffer[] = [];
    
    try {
      for await (const chunk of input.stream) {
        chunks.push(chunk);
      }
    } catch (error) {
      throw new Error(`Failed to read input stream: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (chunks.length === 0) {
      throw new Error('Empty file uploaded');
    }

    const originalBuffer = Buffer.concat(chunks);
    const originalSize = originalBuffer.length;

    try {
      let sharpInstance = sharp(originalBuffer, {
        animated: input.contentType === 'image/gif',
      });

      const metadata = await sharpInstance.metadata();

      // Handle CMYK and other color spaces by converting to RGB
      if (metadata.space && metadata.space !== 'srgb') {
        sharpInstance = sharpInstance.toColorspace('srgb');
      }

      if (metadata.width && metadata.width > opts.maxWidth) {
        sharpInstance = sharpInstance.resize(opts.maxWidth, null, {
          withoutEnlargement: true,
        });
      }

      if (metadata.height && metadata.height > opts.maxHeight) {
        sharpInstance = sharpInstance.resize(null, opts.maxHeight, {
          withoutEnlargement: true,
        });
      }

      let outputFormat: 'jpeg' | 'png' | 'webp' | 'gif';
      let outputBuffer: Buffer;

      switch (input.contentType) {
        case 'image/gif':
          outputFormat = 'gif';
          outputBuffer = await sharpInstance.gif().toBuffer();
          break;
        default:
          outputFormat = 'webp';
          outputBuffer = await sharpInstance.webp({ quality: opts.quality }).toBuffer();
      }

      const compressedStream = Readable.from(outputBuffer);

      const baseName = input.path.replace(/\.[^/.]+$/, '');
      const newPath = `${baseName}.${outputFormat}`;

      return {
        path: newPath,
        contentType: `image/${outputFormat}`,
        stream: compressedStream,
        originalSize,
        compressedSize: outputBuffer.length,
      };
    } catch (error) {
      console.error(`[SharpCompressor] Error compressing image ${input.path}:`, error);
      
      // If compression fails, return original file
      const ext = input.contentType.split('/')[1] || 'jpg';
      const baseName = input.path.replace(/\.[^/.]+$/, '');
      const newPath = `${baseName}.${ext}`;
      
      return {
        path: newPath,
        contentType: input.contentType,
        stream: Readable.from(originalBuffer),
        originalSize,
        compressedSize: originalSize,
      };
    }
  }
}
