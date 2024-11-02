import { Breadcrumb } from "@/components/ui/breadcrumb"
import Title from "./title";

type Props = {
    title: string;
    titleKey: string;
    items: {
        label: string
        href?: string
    }[];
}

export default function SummaryTitle({ title, titleKey, items }: Props) {
    return (
        <div className="flex items-center space-x-4">
            <div className="bg-foreground w-16 h-16 rounded-md"></div>
            <div className="flex flex-col">
                <Breadcrumb items={items} />
                {/* <span className="text-3xl font-bold">{title}</span> */}
                <Title initialValue={title} titleKey={titleKey} />
            </div>
        </div>
    )
}