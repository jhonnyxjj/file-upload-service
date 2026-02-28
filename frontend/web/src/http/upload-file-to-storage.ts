import { env } from '../env/env.parse';
import axios from 'axios';

export { env };

export interface UploadParams {
  file: File;
  signal?: AbortSignal;
  onProgress?: (sizeInBytes: number) => void;
  compressionLevel?: 'low' | 'medium' | 'high';
}


type UploadResponse = {
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
};

export async function uploadFileToStorage({ file, signal, onProgress, compressionLevel = 'medium' }: UploadParams): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('compressionLevel', compressionLevel);

  try {
    const res = await axios.post<{
      url: string;
      originalSize: number;
      compressedSize: number;
      compressionRatio: string;
    }>(
      `${env.apiUrl}/uploads`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: signal,
        onUploadProgress(progressEvent) {
          onProgress?.(progressEvent.loaded);
        },
      }

    );

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
    }


    if (!res.data.url) {
      throw new Error('No URL returned from upload');
    }

    return {
      url: res.data.url,
      originalSize: res.data.originalSize,
      compressedSize: res.data.compressedSize,
      compressionRatio: res.data.compressionRatio,
    };
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    throw new Error('Failed to upload file to storage');
  }
}
