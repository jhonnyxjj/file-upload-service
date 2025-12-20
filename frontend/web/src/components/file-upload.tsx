import { motion, useCycle } from "motion/react";

import { FileUploadList } from "./file-upload-list";
import { FileUploadHeader } from "./file-upload-header";
import * as Collapsible from "@radix-ui/react-collapsible";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { FileUploadMinimizedButton } from "./ui/file-upload-minimized-button";


export function FileUpload() {
    const [isWidgetOpen, toggleOpen] = useCycle(false, true);

    return (
        <Collapsible.Root onOpenChange={() => toggleOpen()}>
            <motion.div className="bg-zinc-900 overflow-hidden w-[95vw] max-w-[95vw] sm:w-[800px] rounded-xl shadow-shape mx-auto sm:mx-0"
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