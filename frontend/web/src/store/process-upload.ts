import { useUploadStore } from "./upload";
import { uploadFileToStorage } from "../http/upload-file-to-storage";
import type { Upload } from "./create-upload";

export async function processUpload(uploadId: string, upload: Upload) {

    if (!upload.file || !upload.name) {
        throw new Error("Invalid upload object");
    }

    try {
        const result = await uploadFileToStorage({
            file: upload.file,
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

