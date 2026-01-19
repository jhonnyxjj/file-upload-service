type UploadStatus = 'progress' | 'success' | 'error' | 'canceled';

export type Upload = {
    name: string;
    file: File;
    status: UploadStatus;
    abortController: AbortController;
    originalSizeInBytes: number;
    compressedSizeInBytes?: number;
    uploadSizeInBytes: number;
    remoteUrl?: string;
}
export function createUpload(file: File): Upload {
    return {
        name: file.name,
        file,
        status: 'progress',
        abortController: new AbortController(),
        originalSizeInBytes: file.size,
        uploadSizeInBytes: 0,
        remoteUrl: undefined,
        compressedSizeInBytes: undefined, 
        
    };
}
