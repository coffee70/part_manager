import { Breadcrumb } from "../ui/breadcrumb"

type Props = {
    title: string;
    items: {
        label: string
        href?: string
    }[];
}

export default function SummaryTitle({ title, items }: Props) {
    return (
        <div className="flex items-center space-x-4">
            <div className="bg-foreground w-16 h-16 rounded-md"></div>
            <div className="flex flex-col">
                <Breadcrumb items={items} />
                <span className="text-3xl text-text font-bold">{title}</span>
            </div>
        </div>
    )
}