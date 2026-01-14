import { useUploadStore } from "./upload";
import { uploadFileToStorage } from "../http/upload-file-to-storage";
import type { Upload } from "./create-upload";
import { compressImage } from "../utils/compress-image";
import { type Resolution } from "../utils/compress-image";

export async function processUpload(uploadId: string, upload: Upload, resolution: Resolution) {

    if (!upload.file || !upload.name) {
        throw new Error("Invalid upload object");
    }

    try {
        const compressedFile = await compressImage(upload.file, resolution);

        useUploadStore.getState().updateUpload(uploadId, {
            name: compressedFile.name,
            file: compressedFile,
        });

        const result = await uploadFileToStorage({
            file: compressedFile,
            onProgress(sizeInBytes: number) {
                useUploadStore.getState().updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes });
            },
            signal: upload.abortController.signal
        });

        useUploadStore.getState().updateUpload(uploadId, { status: 'success' });
        return result;
    } catch (error) {
        useUploadStore.getState().updateUpload(uploadId, { status: upload.abortController.signal.aborted ? 'canceled' : 'error' });
        throw error;
    }
}
