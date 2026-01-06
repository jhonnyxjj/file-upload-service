import { uploadFileToStorage } from "../http/upload-file-to-storage";
import type { Upload } from "./create-upload";

export async function processUpload(upload: Upload){
    
    if( !upload.file || !upload.name) {
        throw new Error("Invalid upload object");
    }

    try {
        const result = await uploadFileToStorage({ file: upload.file, signal: upload.controller.signal });
        console.log(`Upload processed for file: ${upload.name}, URL: ${result.url}`);
        return result;
    } catch (error) {
        console.error(`Failed to process upload for file: ${upload.name}`, error);
        throw error;
    }
}