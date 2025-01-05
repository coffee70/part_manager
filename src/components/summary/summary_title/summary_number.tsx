import { Breadcrumb } from "@/components/ui/breadcrumb"
import Number from "./number";

type Props = {
    number: string;
    items?: {
        label: string
        href: string
    }[];
}

export default function SummaryNumber({ number, items }: Props) {
    return (
        <div className="flex items-center space-x-4">
            <div className="flex flex-col">
                {/** The padding on the breadcrumb matches the built in padding to the Title component */}
                <div className="pl-1">
                    <Breadcrumb items={items ?? []} />
                </div>
                <Number initialValue={number} />
            </div>
        </div>
    )
}