import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"

type BadgeProps = {
  label: string;
  color: string;
  appendIcon?: React.ReactNode;
  className?: string;
}

export function Badge({ label, color, appendIcon, className }: BadgeProps) {
  return (
    <div
      className={cn("inline-flex items-center rounded-sm text-xs text-white font-bold", className)}
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
  return <Badge label={label.toUpperCase()} color={color} className="px-2"/>
}

type ComboboxBadgeProps = {
  label: string;
  onRemove: () => void;
}

export function ComboboxBadge({ label, onRemove }: ComboboxBadgeProps) {
  return <Badge
      label={label}
      color='grey'
      className="px-1"
      appendIcon={
          <button onClick={onRemove} className="pl-0.5">
              <XIcon size={16} />
          </button>
      }
  />
}