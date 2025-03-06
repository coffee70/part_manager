import { Breadcrumb } from "@/components/ui/breadcrumb"
import Number from "./number";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { contextKeys } from "@/lib/query_keys";
import { getContext } from "@/server/contexts/get_context";
import { useQuery } from "@tanstack/react-query";

type Props = {
    number: string;
    items?: {
        label: string
        href: string
    }[];
}

export default function SummaryNumber({ number, items }: Props) {
    const { context, id } = useInstanceURL();

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({ context, id }),
    })

    return (
        <div className="flex items-center space-x-4">
            {contextImpl && <div
                className="w-8 h-8 bg-primary rounded-full ring ring-primary ring-offset-2"
                style={{
                    '--tw-ring-color': contextImpl.color,
                    backgroundColor: contextImpl.color,
                } as React.CSSProperties}
            />}
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