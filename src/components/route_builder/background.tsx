export default function Background() {
    const dotSize = 1;      // Radius of each dot
    const cellSize = 20;    // Distance between adjacent dots
    const color = 'lightgray'; // Background color

    return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} className="-z-10 pointer-events-none">
            <defs>
                <pattern
                    id="dotPattern"
                    x="0"
                    y="0"
                    width={cellSize}
                    height={cellSize}
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx={dotSize} cy={dotSize} r={dotSize} fill={color} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
    );
}