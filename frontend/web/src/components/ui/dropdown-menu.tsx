import { ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { type CompressionLevel } from '../../utils/compress-image';

interface DropdownMenuProps {
  onValueChange: (value: CompressionLevel) => void
  defaultValue: CompressionLevel;
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
              value="low"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>low</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="medium"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>medium</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="high"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none focus:bg-zinc-700"
            >
              <Select.ItemText>high</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
