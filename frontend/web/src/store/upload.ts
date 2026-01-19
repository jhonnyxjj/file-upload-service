import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createUpload } from './create-upload';
import { type Upload } from './create-upload';
import { processUpload } from './process-upload';
import { useShallow } from 'zustand/shallow';
import { type Resolution } from '../utils/compress-image';

interface UploadStore {
  uploads: Map<string, Upload>;
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
  updateUpload: (uploadId: string, update: Partial<Upload>) => void;
  retryUpload: (uploadId: string) => void;
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
      resolution: '1080p',
      setResolution: (resolution: Resolution) => {
        set(state => {
          state.resolution = resolution;
        });
      },
      addUploads(files: File[]) {
        const { resolution } = get();
        files.forEach(file => {
          const uploadId = crypto.randomUUID();
          const upload = createUpload(file);
          set(state => void state.uploads.set(uploadId, upload));
          processUpload(uploadId, upload, resolution);
        });
      },
      cancelUpload(uploadId: string) {
        const upload = get().uploads.get(uploadId);
        if (upload) {
          upload.abortController.abort();
          updateUpload(uploadId, { status: 'canceled', remoteUrl: undefined });
        }
      },
      retryUpload(uploadId: string) {
        const { uploads, resolution } = get();
        const upload = uploads.get(uploadId);

        if (upload) {
          const newAbortController = new AbortController();
          updateUpload(uploadId, { 
            status: 'progress', 
            uploadSizeInBytes: 0,
            abortController: newAbortController,
          });
          processUpload(uploadId, { ...upload, abortController: newAbortController }, resolution);
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
          acc.uploadedBytes += upload.uploadSizeInBytes;
          acc.totalBytes += upload.file.size;
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