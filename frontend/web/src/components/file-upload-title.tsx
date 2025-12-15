import { UploadCloud } from "lucide-react";

export function FileUploadTitle() {
    const hasPendingUploads = true;
    const uploadProgress = 68;

    return (
        <div className="flex items-center gap-2 text-sm sm:text-sm font-medium truncate">
            <UploadCloud className="size-5 text-zinc-300 shrink-0" strokeWidth={1.5} />
            {hasPendingUploads ? (
                <span className="flex items-baseline gap-1">
                    Uploading{" "}
                    <span className="text-xs text-zinc-400 tabular-nums">
                        {uploadProgress}%
                    </span>
                </span>

            ) : (
                <span>Upload files</span>
            )}
        </div>
    );
}