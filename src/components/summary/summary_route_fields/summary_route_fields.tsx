import SummaryBase from "@/components/summary/summary_base";
import RouteFieldsSectionForm from "@/components/summary/summary_route_fields/sections/section_form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRouteFields } from "@/server/routers/get_route_fields";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { routerKeys } from "@/lib/query_keys";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function SummaryRouteFields() {
    const { id, instanceId } = useInstanceURL();

    const [open, setOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<{ _id: string; name: string } | undefined>(undefined);

    const { data, isPending, isError } = useQuery({
        queryKey: routerKeys.routeFields(id, instanceId),
        queryFn: () => getRouteFields({ routerId: id, instanceId })
    });

    const handleAddSection = () => {
        setSelectedSection(undefined);
        setOpen(true);
    };

    const handleEditSection = (section: { _id: string; name: string }) => {
        setSelectedSection(section);
        setOpen(true);
    };

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return (
        <>
            <RouteFieldsSectionForm 
                // This key field is used to force the form to re-render when the section is edited so the 
                // props update and the form is updated with the new section
                // This is an alternative to using useEffect to update the form
                key={selectedSection?._id}
                open={open} 
                setOpen={setOpen} 
                section={selectedSection}
            />
            <SummaryBase title="Route Fields" action={handleAddSection} label="Add Section">
                {data.map((section) => (
                    <div key={section._id}>
                        <div className="group flex items-center justify-between hover:cursor-pointer hover:bg-stone-50 rounded-md px-2 py-1 h-8">
                            <span className="text-xs font-semibold text-stone-500 group-hover:text-stone-700">{section.name.toUpperCase()}</span>
                            <div className="flex items-center gap-2">

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button" className="hover:cursor-pointer hover:bg-stone-200 rounded-full p-1 hidden group-hover:block">
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                                            <span>Add Field</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            type="button" 
                                            className="hover:cursor-pointer hover:bg-stone-200 rounded-full p-1 hidden group-hover:block"
                                            onClick={() => handleEditSection(section)}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                                            <span>Edit Section</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button" className="hover:cursor-pointer hover:bg-stone-200 rounded-full p-1 hidden group-hover:block">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                                            <span>Delete Section</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>

                            </div>
                        </div>
                    </div>
                ))}
            </SummaryBase>
        </>
    )
}