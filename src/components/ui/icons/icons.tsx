import { AlignLeftIcon, BoxesIcon, Building2Icon, DraftingCompassIcon, FactoryIcon, GalleryHorizontalEndIcon, HammerIcon, UserIcon as LucideUserIcon } from "lucide-react"

type Props = {
    size?: number;
}

export function CustomerOrderIcon({ size }: Props) {
    return (
        <div className="bg-fuchsia-600 p-1 rounded-md text-white">
            <GalleryHorizontalEndIcon size={size} />
        </div>
    )
}

export function ShopOrderIcon({ size }: Props) {
    return (
        <div className="bg-orange-600 p-1 rounded-md text-white">
            <FactoryIcon size={size} />
        </div>
    )
}

export function PartIcon({ size }: Props) {
    return (
        <div className="bg-emerald-600 p-1 rounded-md text-white">
            <DraftingCompassIcon size={size} />
        </div>
    )
}

export function SerialIcon({ size }: Props) {
    return (
        <div className="bg-blue-600 p-1 rounded-md text-white">
            <HammerIcon size={size} />
        </div>
    )
}

export function CustomerIcon({ size }: Props) {
    return (
        <div className="bg-rose-600 p-1 rounded-md text-white">
            <Building2Icon size={size} />
        </div>
    )
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