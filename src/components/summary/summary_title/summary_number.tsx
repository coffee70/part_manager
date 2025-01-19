import { Breadcrumb } from "@/components/ui/breadcrumb"
import Number from "./number";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { modelKeys } from "@/lib/query_keys";
import { getModel } from "@/server/models/get_model";
import { useQuery } from "@tanstack/react-query";

type Props = {
    number: string;
    items?: {
        label: string
        href: string
    }[];
}

export default function SummaryNumber({ number, items }: Props) {
    const { modelId } = useInstanceURL();

    const { data: model } = useQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    return (
        <div className="flex items-center space-x-4">
            {model && <div
                className="w-8 h-8 bg-primary rounded-full ring ring-primary ring-offset-2"
                style={{
                    '--tw-ring-color': model.color,
                    backgroundColor: model.color,
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