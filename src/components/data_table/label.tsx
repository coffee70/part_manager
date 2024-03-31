type Props = {
    label: string;
    subLabel?: string;
}

export default function Label({ label, subLabel }: Props) {
    return (
        <div className="flex flex-col">
            <span className="text-text font-bold">{label}</span>
            <span className="text-sm text-text">{subLabel}</span>
        </div>
    )
}