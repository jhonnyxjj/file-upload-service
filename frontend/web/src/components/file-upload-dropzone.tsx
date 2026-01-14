import { useDropzone } from "react-dropzone";
import { CircularProgressBar } from "./ui/circular-progress-bar";
import { motion } from "motion/react";
import { usePendingUploads, useUploadStore } from "../store/upload";
import { DropdownMenu } from "./ui/dropdown-menu";

export function FileUploadDropzone() {
    const addUploads = useUploadStore(store => store.addUploads);
    const resolution = useUploadStore(store => store.resolution);
    const setResolution = useUploadStore(store => store.setResolution);

    const uploadCount = useUploadStore(store => store.uploads.size);
    const { hasPendingUploads, globalPercentage } = usePendingUploads();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: true,
        accept: {
            "image/jpeg": [],
            "image/png": [],
        },
        onDrop(acceptedFiles) {
            addUploads(acceptedFiles);
        },
    });

    return (
        <motion.div className="px-4 sm:px-4 flex flex-col gap-3"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div
                data-active={isDragActive}
                className="cursor-pointer text-zinc-400 bg-black/20 p-4 sm:p-5 rounded-lg border border-zinc-700 border-dashed h-40 sm:h-32 flex flex-col items-center justify-center gap-2 hover:border-zinc-600 transition-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-green-600 text-center"
                {...getRootProps()}
            >
                <input type="file" {...getInputProps()} />

                {hasPendingUploads ? (
                    <div className="flex flex-col gap-2.5 items-center">
                        <CircularProgressBar
                            progress={globalPercentage}
                            size={56}
                            strokeWidth={4}
                        />
                        <span className="text-xs">Uploading {uploadCount} files...</span>
                    </div>
                ) : (
                    <>
                        <span className="text-xs">Drop your files here or</span>
                        <span className="text-xs underline">click to open picker</span>
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xxs sm:text-xs text-zinc-400">
                    Resolution:
                </span>
                <DropdownMenu onValueChange={(value) => {
                    console.log('Resolution selected:', value);
                    setResolution(value);
                }} defaultValue={resolution} />
            </div>


            <span className="text-xxs sm:text-xs text-zinc-400">
                Only PNG and JPG files are supported.
            </span>
        </motion.div>
    );
}