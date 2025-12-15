import * as Collapsible from "@radix-ui/react-collapsible";

import { Minimize2 } from "lucide-react";
import { Button } from "./ui/buttons";
import { FileUploadTitle } from "./file-upload-title";

export function FileUploadHeader() {
  return (
    <div className="w-full p-4 sm:p-4 py-3 sm:py-2 bg-white/2 border-zinc-800 border-b flex items-center justify-between gap-2">
      <FileUploadTitle />

      <Collapsible.Trigger asChild>
        <Button size="icon" className="-mr-2">
          <Minimize2 strokeWidth={1.5} className="size-4" />
        </Button>
      </Collapsible.Trigger>
    </div>
  );
}
