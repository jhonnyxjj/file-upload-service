type UploadStatus = 'progress' | 'success' | 'error' | 'canceled';

export type Upload = {
    name: string;
    file: File;
    status: UploadStatus;
    controller: AbortController;
}
export function createUpload(file: File): Upload {
    return {
        name: file.name,
        file,
        status: 'progress',
        controller: new AbortController()
    };
}
