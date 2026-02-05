import { env } from '../env/env.parse';
import axios from 'axios';

export { env };

export interface UploadParams {
  file: File;
  signal?: AbortSignal;
  onProgress?: (sizeInBytes: number) => void;
}


type UploadResponse = {
  url: string;
};

export async function uploadFileToStorage({ file, signal, onProgress }: UploadParams): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post<{ url: string }>(
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

    return { url: res.data.url };
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    throw new Error('Failed to upload file to storage');
  }
}