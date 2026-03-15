import { useUploadStore } from "./upload";
import { env, uploadFileToStorage } from "../http/upload-file-to-storage";
import type { Upload } from "./create-upload";

export async function processUpload(uploadId: string, upload: Upload, compressionLevel: 'low' | 'medium' | 'high' = 'medium') {

    if (!upload.file || !upload.name) {
        throw new Error("Invalid upload object");
    }

    try {
        const response = await uploadFileToStorage({
            file: upload.file,
            onProgress(sizeInBytes: number) {
                useUploadStore.getState().updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes });
            },
            signal: upload.abortController.signal,
            compressionLevel,
        });

        const cleanUrl = response.url.replace(`${env.apiUrl}/`, "");

        useUploadStore.getState().updateUpload(uploadId, { 
            status: 'success', 
            remoteUrl: cleanUrl,
            compressedSizeInBytes: response.compressedSize,
        });
        return response.url;
    } catch (error) {
        useUploadStore.getState().updateUpload(uploadId, { status: upload.abortController.signal.aborted ? 'canceled' : 'error' });
        throw error;
    }
}
