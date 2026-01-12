import { motion, useCycle } from "motion/react";

import { FileUploadList } from "./file-upload-list";
import { FileUploadHeader } from "./file-upload-header";
import * as Collapsible from "@radix-ui/react-collapsible";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { FileUploadMinimizedButton } from "./ui/file-upload-minimized-button";
import { usePendingUploads } from "../store/upload";


export function FileUpload() {
    const {hasPendingUploads} = usePendingUploads();

    const [isWidgetOpen, toggleOpen] = useCycle(false, true);

    return (
        <Collapsible.Root onOpenChange={() => toggleOpen()} asChild>

            <motion.div data-progress={hasPendingUploads}
                className="bg-zinc-900 overflow-hidden w-[95vw] max-w-[95vw] sm:w-[800px] rounded-xl shadow-shape mx-auto sm:mx-0 
                data-[state=open]:shadow-shape border border-transparent animate-border data-[state=closed]:rounded-3xl data-[state=closed]:data-[progress=false]:shadow-shape  
                data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,--theme(--color-zinc-900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),--theme(--color-zinc-700/.48)_80%,--theme(--color-green-500)_86%,--theme(--color-green-300)_90%,--theme(--color-green-500)_94%,--theme(--color-zinc-600/.48))_border-box]"

                animate={isWidgetOpen ? "open" : "closed"}
                variants={{
                    closed: { height: 44, opacity: 1 },
                    open: { height: 'auto', opacity: 1 },
                }}
                transition={{ duration: 0.3, ease: "easeIn" }}
            >

                {!isWidgetOpen && <FileUploadMinimizedButton />}

                <Collapsible.Content>
                    <FileUploadHeader />

                    <div className="flex flex-col gap-6 py-4 sm:py-3 h-full">
                        <FileUploadDropzone />

                        <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

                        <FileUploadList />
                    </div>
                </Collapsible.Content>
            </motion.div>
        </Collapsible.Root>
    );
}