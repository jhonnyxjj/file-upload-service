import * as Progress from "@radix-ui/react-progress";
import { Download, ImageUp, Link2, RefreshCcw, X, Check } from "lucide-react";
import { Button } from "./ui/buttons";
import { motion, AnimatePresence } from "motion/react";
import { useUploadStore } from "../store/upload";
import { type Upload } from "../store/create-upload";
import { formatBytes } from "../utils/format-bytes";
import { useState } from "react";

interface FileUploadItemProps {
    upload: Upload;
    uploadId: string;
}

export function FileUploadItem({ upload, uploadId,  }: FileUploadItemProps) {
    const [copied, setCopied] = useState(false);
    const cancelUpload = useUploadStore((store) => store.cancelUpload);
    const retryUpload = useUploadStore((store) => store.retryUpload);

    const progress = upload.file.size
        ? Math.round((upload.uploadSizeInBytes * 100) / upload.file.size)
        : 0;

    // Calcula a economia de espaço em porcentagem após a compressão da imagem.
    const percentageSaved = Math.round(
        (1 - upload.file.size / upload.originalSizeInBytes) * 100
    );

    async function handleCopy() {
        if (upload.remoteUrl) {
            await navigator.clipboard.writeText(upload.remoteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    // Cria um link temporário para forçar o download do arquivo no navegador.
    async function handleDownload() {
        if (upload.remoteUrl) {
            const response = await fetch(upload.remoteUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = upload.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }
    }

    return (
        <motion.div
            className="p-3 sm:p-3 rounded-lg flex flex-col gap-3 sm:gap-3 shadow-shape-content bg-white/2 relative"
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
                    {upload.status === "success" || upload.status === "progress" ? (
                        <>
                            <span>{formatBytes(upload.originalSizeInBytes)}</span>
                            <div className="size-1 rounded-full bg-zinc-700" />
                            <span>
                                {formatBytes(upload.file.size ?? 0)}
                                <span className="text-green-400 ml-1">{percentageSaved}% saved</span>
                            </span>
                            <div className="size-1 rounded-full bg-zinc-700" />
                            {upload.status === "success" && <span>100%</span>}
                            {upload.status === "progress" && <span>{progress}%</span>}
                        </>
                    ) : (
                        <>
                            {upload.status === "error" && (
                                <span className="text-red-400">Error</span>
                            )}
                            {upload.status === "canceled" && (
                                <span className="text-yellow-400">Canceled</span>
                            )}
                        </>
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
                <Button onClick={handleDownload} size="icon-sm" disabled={upload.status !== "success"}>
                        <Download className="size-4" strokeWidth={1.5} />
                        <span className="sr-only">download image</span>
                </Button>

                <Button 
                    size="icon-sm" 
                    disabled={!upload.remoteUrl} 
                    onClick={handleCopy}
                    className="relative"
                >
                    {copied ? (
                        <Check className="size-4 text-green-400" strokeWidth={2} />
                    ) : (
                        <Link2 className="size-4" strokeWidth={1.5} />
                    )}
                    
                    <AnimatePresence>
                        {copied && (
                            <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 right-0 bg-zinc-800 text-white text-xxs px-2 py-1 rounded shadow-lg border border-zinc-700 whitespace-nowrap"
                            >
                                Copied!
                            </motion.span>
                        )}
                    </AnimatePresence>
                    
                    <span className="sr-only">Copy URL</span>
                </Button>

                <Button
                    disabled={!["canceled", "error"].includes(upload.status)}
                    size="icon-sm"
                    onClick={() => retryUpload(uploadId)}
                >
                    <RefreshCcw className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Try again</span>
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
