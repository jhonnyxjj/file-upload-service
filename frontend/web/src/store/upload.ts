import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createUpload } from './create-upload';
import { type Upload } from './create-upload';
import { processUpload } from './process-upload';

type UploadState = {
    uploads: Map<string, Upload>;
};

interface UploadActions {
    addUploads: (files: File[]) => void;
    // refreshUploads: () => void;
    cancelUpload: (uploadId: string) => void;
}

enableMapSet();

export const useUploadStore = create<UploadState & UploadActions, [["zustand/immer", never]]>(
    immer((set, get) => {
        function addUploads(files: File[]) {
            for (const file of files) {
                const uploadId = crypto.randomUUID();
                const upload = createUpload(file);

                set(state => {
                    state.uploads.set(uploadId, upload);
                    console.log(`Added upload: ${upload.name} with ID: ${uploadId}`);
                });

                processUpload(upload);
            }
        }

        // function refreshUploads() {
        //     set(state => {
        //         state.uploads.forEach((upload, uploadId) => {
        //             if (upload.status === 'progress') {
        //                 state.uploads.set(uploadId, upload);
        //                 console.log(`Refreshed upload: ${upload.name} with ID: ${uploadId}`);
        //             }
        //         });
        //     });
        // }

        function cancelUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId);

            if (!upload) {
                return;
            }

            upload.controller.abort();

            set(state => {
                state.uploads.set(uploadId, {
                    ...upload,
                    status: 'canceled',
                });
            });
        }

        return {
            uploads: new Map(),
            addUploads,
            cancelUpload,
        };
    })
);
