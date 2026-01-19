import axios from 'axios';

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
      "http://localhost:3000/uploads",
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

    if (!res.data.url) {
      throw new Error('No URL returned from upload');
    }

    console.log('Upload response:', res);
    return { url: res.data.url };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file to storage');
  }
}