import axios from 'axios';

interface UploadParams {
    file: File;
    signal?: AbortSignal;
}

export async function uploadFileToStorage({ file, signal }: UploadParams) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<{ url: string }>(
    "http://localhost:3333/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: signal
    }
  );

    return { url: response.data.url };
}