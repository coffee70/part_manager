import { AlignLeftIcon, BoxesIcon, Building2Icon, DraftingCompassIcon, FactoryIcon, GalleryHorizontalEndIcon, HammerIcon, UserIcon as LucideUserIcon } from "lucide-react"

type Props = {
    size?: number;
}

export function ModelIcon({ size }: Props) {
    return (
        <div className="bg-rose-600 p-1 rounded-md text-white">
            <BoxesIcon size={size} />
        </div>
    )
}

export function FieldIcon({ size }: Props) {
    return (
        <div className="bg-sky-600 p-1 rounded-md text-white">
            <AlignLeftIcon size={size} />
        </div>
    )
}

export function UserIcon({ size }: Props) {
    return (
        <div className="bg-lime-600 p-1 rounded-md text-white">
            <LucideUserIcon size={size} />
        </div>
    )
}