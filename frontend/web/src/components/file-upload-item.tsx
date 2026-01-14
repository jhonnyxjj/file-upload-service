import * as Progress from "@radix-ui/react-progress";

import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/buttons";
import { motion } from "motion/react";
import { useUploadStore } from "../store/upload";
import { type Upload } from "../store/create-upload";
import { formatBytes } from "../utils/format-bytes";

interface FileUploadItemProps {
    upload: Upload;
    uploadId: string;
}

export function FileUploadItem({ upload, uploadId }: FileUploadItemProps) {
    const cancelUpload = useUploadStore((store) => store.cancelUpload);

    const progress = Math.min(
        Math.round((upload.uploadSizeInBytes * 100) / upload.file.size),
        100
    );

    const percentageSaved = Math.round(
        (1 - upload.file.size / upload.originalSizeInBytes) * 100
    );

    return (
        <motion.div className="p-3 sm:p-3 rounded-lg flex flex-col gap-3 sm:gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-col gap-1 pr-20 sm:pr-0">
                <span className="text-sm sm:text-sm font-medium flex items-center gap-2 truncate">
                    <ImageUp className="size-4 text-zinc-300 shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{upload.name}</span>
                </span>

                <span className="text-xs text-zinc-400 flex flex-wrap gap-1.5 sm:gap-1.5 items-center">
                    <span>{formatBytes(upload.originalSizeInBytes)}</span>
                    <div className="size-1 rounded-full bg-zinc-700" />
                    <span>
                        {formatBytes(upload.file.size)}
                        <span className="text-green-400 ml-1">{percentageSaved}% saved</span>
                    </span>
                    <div className="size-1 rounded-full bg-zinc-700" />

                    {upload.status === "success" && <span>100%</span>}
                    {upload.status === "progress" && <span>{progress}%</span>}
                    {upload.status === "error" && (
                        <span className="text-red-400">Error</span>
                    )}
                    {upload.status === "canceled" && (
                        <span className="text-yellow-400">Canceled</span>
                    )}
                </span>
            </div>

            <Progress.Root
                data-status={upload.status}
                className="group bg-zinc-800 rounded-full h-1 overflow-hidden">
                <Progress.Indicator
                    className="bg-gray-600 h-1 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-yellow-400"
                    style={{ width: upload.status === "progress" ? `${progress}%` : "100%" }}

                />
            </Progress.Root>

            <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                <Button size="icon-sm" disabled={upload.status !== "success"}>
                    <Download className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Download compressed image</span>
                </Button>

                <Button size="icon-sm" disabled={upload.status !== "success"}>
                    <Link2 className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Copy remote URL</span>
                </Button>

                <Button
                    disabled={!["canceled", "error"].includes(upload.status)}
                    size="icon-sm"
                >
                    <RefreshCcw className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Retry upload</span>
                </Button>

                <Button
                    disabled={upload.status !== "progress"}
                    size="icon-sm"
                    onClick={() => cancelUpload(uploadId)}
                >
                    <X className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Cancel upload</span>
                </Button>
            </div>
        </motion.div>
    );
}
