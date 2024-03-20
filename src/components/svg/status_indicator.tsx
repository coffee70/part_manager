type Props = {
    width: number;
    height: number;
    color: string;
}

export default function StatusIndicator({ width, height, color }: Props) {
    return (
        <svg width={width} height={height} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.5" cy="7.5" r="7.5" fill={color} />
        </svg>
    )
}