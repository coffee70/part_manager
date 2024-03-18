import { Calendar } from "lucide-react";

type Props = {
    children: React.ReactNode;
}
function Filter(props: Props) {
    const { children } = props
    return <button
        className="w-min bg-foreground border border-border text-black p-2"
    >{children}</button>
}

export function DateFilter() {
    return <Filter>
        <Calendar />
    </Filter>
}