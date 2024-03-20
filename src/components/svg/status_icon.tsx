import Image from "next/image";

type Props = {
    width: number;
    height: number;
}

export default function StatusIcon({ width, height }: Props) {
    return <Image
        priority
        src="./status_icon.svg"
        alt="Status"
        width={width}
        height={height}
    />
}