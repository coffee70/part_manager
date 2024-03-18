import { Calendar } from "lucide-react";

type Props = {
    children: React.ReactNode;
}
function Filter(props: Props) {
    const { children } = props
    return <div
        className="w-min bg-foreground text-muted-foreground p-2"
    >{children}</div>
}

export function DateFilter() {
    return <Filter>
        <Calendar />
    </Filter>
}