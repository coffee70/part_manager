type Props = {
    color: string;
}

export default function StatusIndicator({ color }: Props) {
    return (
        <svg width={12} height={12} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.5" cy="7.5" r="7.5" fill={color} />
        </svg>
    )
}