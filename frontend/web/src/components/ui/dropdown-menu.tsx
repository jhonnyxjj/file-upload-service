import { ChevronDown } from 'lucide-react'
import * as Select from '@radix-ui/react-select'

export type Resolution = '4k' | '1080p' | '720p'

interface DropdownMenuProps {
  onValueChange: (value: Resolution) => void
  defaultValue: Resolution
}

export function DropdownMenu({
  defaultValue,
  onValueChange,
}: DropdownMenuProps) {
  return (
    <Select.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Trigger className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 shadow-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-500/10">
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          side="bottom"
          position="popper"
          sideOffset={8}
          className="w-radix-select-trigger rounded-lg border border-zinc-700 bg-zinc-800 font-medium text-zinc-300 shadow-sm"
        >
          <Select.Viewport>
            <Select.Item
              value="720p"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>720p</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="1080p"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>1080p</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="4k"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>4K</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
