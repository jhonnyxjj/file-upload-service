import * as Progress from "@radix-ui/react-progress";

import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/buttons";

export function FileUploadItem() {
    return (
        <div className="p-3 sm:p-3 rounded-lg flex flex-col gap-3 sm:gap-3 shadow-shape-content bg-white/2 relative overflow-hidden">
            <div className="flex flex-col gap-1 pr-20 sm:pr-0">
                <span className="text-sm sm:text-sm font-medium flex items-center gap-2 truncate">
                    <ImageUp className="size-4 text-zinc-300 shrink-0" strokeWidth={1.5} />
                    <span className="truncate">screenshot.png</span>
                </span>

                <span className="text-xs text-zinc-400 flex flex-wrap gap-1.5 sm:gap-1.5 items-center">
                    <span className="line-through">3MB</span>
                    <div className="size-1 rounded-full bg-zinc-700" />
                    <span>
                        300KB
                        <span className="text-green-400 ml-1">-94%</span>
                    </span>
                    <div className="size-1 rounded-full bg-zinc-700" />
                    <span>45%</span>
                </span>
            </div>

            <Progress.Root className="bg-zinc-800 rounded-full h-1 overflow-hidden">
                <Progress.Indicator
                    className="bg-indigo-500 h-1"
                    style={{ width: "43%" }}
                />
            </Progress.Root>

            <div className="absolute top-3 right-3 sm:top-2.5 sm:right-2.5 flex items-center gap-1 sm:gap-1">
                <Button size="icon-sm">
                    <Download className="size-4 sm:size-4" strokeWidth={1.5} />
                    <span className="sr-only">Download compressed image</span>
                </Button>

                <Button size="icon-sm">
                    <Link2 className="size-4 sm:size-4" strokeWidth={1.5} />
                    <span className="sr-only">Copy remote URL</span>
                </Button>

                <Button size="icon-sm">
                    <RefreshCcw className="size-4 sm:size-4" strokeWidth={1.5} />
                    <span className="sr-only">Retry upload</span>
                </Button>

                <Button size="icon-sm">
                    <X className="size-4 sm:size-4" strokeWidth={1.5} />
                    <span className="sr-only">Cancel upload</span>
                </Button>
            </div>
        </div>
    );
}
