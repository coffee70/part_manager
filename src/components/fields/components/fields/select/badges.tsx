import { ComboboxBadge } from "@/components/ui/badge"

export default function Badges({
    value,
    multiple,
    handleRemove
}: {
    value?: string | string[];
    multiple?: boolean;
    handleRemove: (v: string) => void;
}) {
    return (
        <div className="flex items-center space-x-0.5 pr-1">
            {multiple && Array.isArray(value) && value.length > 0 && value.map((v) => (
                <ComboboxBadge key={v} label={v} onRemove={() => handleRemove(v)} />
            ))}
        </div>
    )
}