'use client'
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { instanceKeys } from "@/lib/query_keys";
import { getInstance } from "@/server/instances/get_instance";
import { useQuery } from "@tanstack/react-query";
import { TitleRouterIcon } from "@/components/ui/icons/icons";
import { router } from "@/lib/url";

export default function Header() {
    const { modelId, instanceId } = useModelInstanceRoutingURL();

    const { data: instance, isPending, isError } = useQuery({
        queryKey: instanceKeys.id("models", modelId, instanceId),
        queryFn: () => getInstance({ id: modelId, instanceId }),
    })

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    if (!instance) return <div>Instance not found</div>

    return (
        <div className="flex items-center space-x-4 py-4 px-8 bg-stone-100 border-b border-stone-300 shadow-sm">
            <TitleRouterIcon size={40} />
            <div className="flex flex-col">
                {/** The padding on the breadcrumb matches the built in padding to the Title component */}
                <Breadcrumb items={[{
                    label: instance.number,
                    href: router().models().instances().instance(modelId, instanceId)
                }]} />
                <span className="text-xl font-bold">Routing</span>
            </div>
        </div>
    )
}