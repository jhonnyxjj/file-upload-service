import { UploadCloud } from "lucide-react";

export function FileUploadTitle() {
    return (
        <div className="flex items-center gap-1.5 text-sm font-medium">
            <UploadCloud className="size-4 text-zinc-300" strokeWidth={1.5}

            />
            <span>Upload your file</span>
        </div>
    );
}