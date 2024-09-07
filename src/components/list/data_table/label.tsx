type Props = {
    label: string;
    subLabel?: string;
}

export default function Label({ label, subLabel }: Props) {
    return (
        <div className="flex flex-col">
            <span className="font-bold">{label}</span>
            <span className="text-sm">{subLabel}</span>
        </div>
    )
}