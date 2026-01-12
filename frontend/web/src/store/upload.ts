import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createUpload } from './create-upload';
import { type Upload } from './create-upload';
import { processUpload } from './process-upload';
import { useShallow } from 'zustand/shallow';

interface UploadStore {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
  updateUpload: (uploadId: string, update: Partial<Upload>) => void;
};

enableMapSet();



export const useUploadStore = create<UploadStore, [["zustand/immer", never]]>(
  immer((set, get) => {

    function updateUpload(uploadId: string, update: Partial<Upload>) {
      set(state => {
        const current = state.uploads.get(uploadId);
        if (current) {
          state.uploads.set(uploadId, { ...current, ...update });
        }
      });
    }

    return {
      uploads: new Map(),
      addUploads(files: File[]) {
        files.forEach(file => {
          const uploadId = crypto.randomUUID();
          const upload = createUpload(file);
          set(state => void state.uploads.set(uploadId, upload));
          processUpload(uploadId, upload);
        });
      },
      cancelUpload(uploadId: string) {
        const upload = get().uploads.get(uploadId);
        if (upload) {
          upload.abortController.abort();
          updateUpload(uploadId, { status: 'canceled' });
        }
      },
      updateUpload,
    };
  })
);

export const usePendingUploads = () => {
  return useUploadStore(
    useShallow(state => {
      const pendingUploads = Array.from(state.uploads.values())
        .filter(upload => upload.status === 'progress');

      const hasPendingUploads = pendingUploads.length > 0;

      // Sempre calcula, retorna sempre o mesmo formato
      const { totalBytes, uploadedBytes } = pendingUploads.reduce(
        (acc, upload) => {
          acc.totalBytes += upload.originalSizeInBytes;
          acc.uploadedBytes += upload.uploadSizeInBytes;
          console.log(acc);
          return acc;
        },
        { totalBytes: 0, uploadedBytes: 0 }
      );
      const globalPercentage = totalBytes > 0
        ? Math.min(Math.round((uploadedBytes * 100) / totalBytes), 100)
        : 0;

      return {
        hasPendingUploads,
        globalPercentage,
      };
    })
  );
};