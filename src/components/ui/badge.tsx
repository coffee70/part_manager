import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

type BadgeProps = {
  label: string;
  color?: string;
  appendIcon?: React.ReactNode;
  className?: string;
}

export function Badge({ label, color, appendIcon, className }: BadgeProps) {
  return (
    <div
      className={cn("inline-flex items-center rounded-sm text-xs text-white text-nowrap font-bold", className)}
      style={{ backgroundColor: color }}
    >
      <span>{label}</span>
      {appendIcon}
    </div>
  )
}

type StatusBadgeProps = {
  label: string;
  color: string;
}

export function StatusBadge({ label, color }: StatusBadgeProps) {
  return <Badge label={label.toUpperCase()} color={color} className="px-2" />
}

type ComboboxBadgeProps = {
  label: string;
  onRemove: () => void;
}

export function ComboboxBadge({ label, onRemove }: ComboboxBadgeProps) {
  return <Badge
    label={label}
    className="mr-1 my-0.5 pl-1.5 bg-foreground text-text text-sm font-normal"
    appendIcon={
      <button
        onClick={onRemove}
        className="ml-0.5 p-1.5 rounded-sm hover:bg-destructive-foreground hover:text-destructive">
        <XIcon
          size={12}
          strokeWidth={2.5}
        />
      </button>
    }
  />
}