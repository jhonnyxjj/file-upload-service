import { useUploadStore } from "./upload";
import { uploadFileToStorage } from "../http/upload-file-to-storage";
import type { Upload } from "./create-upload";
import { compressImage } from "../utils/compress-image";
import { type CompressionLevel } from "../utils/compress-image";

export async function processUpload(uploadId: string, upload: Upload, compressionLevel: CompressionLevel) {

    if (!upload.file || !upload.name) {
        throw new Error("Invalid upload object");
    }

    try {
        const compressedFile = await compressImage(upload.file, compressionLevel);

        useUploadStore.getState().updateUpload(uploadId, {
            name: compressedFile.name,
            file: compressedFile,
            compressedSizeInBytes: compressedFile.size,
        });

        const { url } = await uploadFileToStorage({
            file: compressedFile,
            onProgress(sizeInBytes: number) {
                useUploadStore.getState().updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes });
            },
            signal: upload.abortController.signal
        });

        const urlWithCacheBust = `${url}?t=${new Date().getTime()}`;

        useUploadStore.getState().updateUpload(uploadId, { status: 'success', remoteUrl: urlWithCacheBust });
        return url;
    } catch (error) {
        useUploadStore.getState().updateUpload(uploadId, { status: upload.abortController.signal.aborted ? 'canceled' : 'error' });
        throw error;
    }
}
