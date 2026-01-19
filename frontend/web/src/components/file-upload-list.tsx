import * as ScrollArea from "@radix-ui/react-scroll-area";
import { FileUploadItem } from "./file-upload-item";
import { useUploadStore } from "../store/upload";

export function FileUploadList() {
  const uploads = useUploadStore((state) => state.uploads);
  const uploadArray = Array.from(uploads.entries());
  const hasUploads = uploads.size

  return (
    <div className="px-4 sm:px-4 flex flex-col gap-3 flex-1 overflow-y-auto">
      <span className="text-sm sm:text-sm font-medium">
        Uploaded files <span className="text-zinc-400">({uploads.size})</span>
      </span>
      <ScrollArea.Root type="scroll" className="overflow-hidden">
        <ScrollArea.Viewport className="h-55">

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


        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-zinc-800 p-0.5 transition-colors duration-160 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>

      </ScrollArea.Root>

    </div>
  );
}


