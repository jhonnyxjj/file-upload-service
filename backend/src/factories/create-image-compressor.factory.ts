import { ImageCompressor } from '../infra/image/contracts';
import { SharpCompressor } from '../infra/image/sharp-compressor';

let compressorInstance: ImageCompressor | null = null;

export function makeImageCompressor(): ImageCompressor {
  if (!compressorInstance) {
    compressorInstance = new SharpCompressor();
  }
  return compressorInstance;
}
