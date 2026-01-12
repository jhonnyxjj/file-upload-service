import { FileUploadItem } from "./file-upload-item";
import { useUploadStore } from "../store/upload";

export function FileUploadList() {
  const uploads = useUploadStore((state) => state.uploads);
  const uploadArray = Array.from(uploads.entries());
  const hasUploads = uploadArray.length > 0;

  return (
    <div className="px-4 sm:px-4 flex flex-col gap-3 flex-1 overflow-y-auto">
      <span className="text-sm sm:text-sm font-medium">
        Uploaded files <span className="text-zinc-400">({uploadArray.length})</span>
      </span>

      {hasUploads ? (
        <div className="flex flex-col gap-2">
          {uploadArray.map(([uploadId, upload]) => (
            <FileUploadItem
              key={uploadId}
              upload={upload}
              uploadId={uploadId}
            />
          ))}
        </div>
      ) : (
        <span className="text-xs text-zinc-400">
          No uploads yet. Add a file to get started.
        </span>
      )}
    </div>
  );
}