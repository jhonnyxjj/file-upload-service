import { FileUploadItem } from "./file-upload-upload-item";

export function FileUploadList() {
  const hasUploads = true;

  return (
    <div className="px-4 sm:px-4 flex flex-col gap-3 flex-1 overflow-y-auto">
      <span className="text-sm sm:text-sm font-medium">
        Uploaded files <span className="text-zinc-400">(2)</span>
      </span>

      {hasUploads ? (
        <div className="flex flex-col gap-2">
          <FileUploadItem />
          <FileUploadItem />
        </div>
      ) : (
        <span className="text-xs text-zinc-400">
          No uploads yet. Add a file to get started.
        </span>
      )}
    </div>
  );
}