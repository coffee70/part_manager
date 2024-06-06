import React from "react";
import { BUFFER } from "./constants";

export default function useBuffer({ hovered }: { hovered: boolean }) {
    const [buffer, setBuffer] = React.useState<number>(BUFFER);

    React.useEffect(() => {
        if (hovered) {
            setBuffer(BUFFER - 1);
        } else {
            setBuffer(BUFFER);
        }
    }, [hovered]);

    return { buffer: buffer };
}