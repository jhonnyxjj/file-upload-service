import { create } from 'zustand';

export type Upload = {
    name: string;
    file: File;
}

type UploadState = {
    uploads: Record<string, Upload>;
}

interface UploadActions {
    addUploads: (files: File[]) => void;
}

export const useUploadStore = create<UploadState & UploadActions>((set, _get) => {
    function addUploads(files: File[]) {
        const newEntries = Object.fromEntries(
            files.map(file => [
                crypto.randomUUID(),
                {
                    name: file.name,
                    file: file
                }
            ])
        );

        set((state) => ({
            uploads: { ...state.uploads, ...newEntries }
        }));
    }

    return {
        uploads: {},
        addUploads,
    }
});