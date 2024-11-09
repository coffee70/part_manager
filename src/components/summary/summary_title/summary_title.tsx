import { Breadcrumb } from "@/components/ui/breadcrumb"
import Title from "./title";

type Props = {
    title: string;
    titleKey: string;
    items?: {
        label: string
        href?: string
    }[];
    children: React.ReactNode;
}

export default function SummaryTitle({ title, titleKey, items, children }: Props) {
    return (
        <div className="flex items-center space-x-4">
            {children}
            <div className="flex flex-col">
                <Breadcrumb items={items ?? []} />
                <Title initialValue={title} titleKey={titleKey} />
            </div>
        </div>
    )
}