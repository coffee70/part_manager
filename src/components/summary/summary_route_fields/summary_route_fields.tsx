import SummaryBase from "@/components/summary/summary_base";
import RouteFieldsSectionForm from "@/components/summary/summary_route_fields/sections/section_form";
import FieldForm from "@/components/summary/summary_route_fields/fields/field_form";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRouteFields } from "@/server/routers/get_route_fields";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { routerKeys } from "@/lib/query_keys";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Dialog type to track which dialog is currently open
type DialogType = "section" | "field" | null;

// Section type matching the expected type in the section form
type Section = { _id: string; name: string };

export default function SummaryRouteFields() {
    const { id, instanceId } = useInstanceURL();

    // Track which section is selected (for both dialogs)
    const [selectedSection, setSelectedSection] = useState<{ _id: string; name?: string } | undefined>(undefined);
    
    // Track which dialog is open
    const [openDialog, setOpenDialog] = useState<DialogType>(null);

    const { data, isPending, isError } = useQuery({
        queryKey: routerKeys.routeFields(id, instanceId),
        queryFn: () => getRouteFields({ routerId: id, instanceId })
    });

    const handleAddSection = () => {
        setSelectedSection(undefined);
        setOpenDialog("section");
    };

    const handleEditSection = (section: Section) => {
        setSelectedSection(section);
        setOpenDialog("section");
    };

    const handleAddField = (sectionId: string) => {
        setSelectedSection({ _id: sectionId });
        setOpenDialog("field");
    };

    // Helper functions to handle dialog open/close
    const handleSectionDialogChange = (open: boolean) => {
        if (!open) setOpenDialog(null);
    };

    const handleFieldDialogChange = (open: boolean) => {
        if (!open) setOpenDialog(null);
    };

    // Get section data in the correct format for the section form
    const getSectionForForm = (): Section | undefined => {
        if (!selectedSection || !selectedSection.name) return undefined;
        return {
            _id: selectedSection._id,
            name: selectedSection.name
        };
    };

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return (
        <>
            <RouteFieldsSectionForm 
                key={`section-form-${selectedSection?._id || "new"}`}
                open={openDialog === "section"} 
                setOpen={handleSectionDialogChange} 
                section={getSectionForForm()}
            />
            
            <FieldForm
                key={`field-form-${selectedSection?._id || "new"}`}
                open={openDialog === "field"}
                onOpenChange={handleFieldDialogChange}
                sectionId={selectedSection?._id || ""}
            />

            <SummaryBase title="Route Fields" action={handleAddSection} label="Add Section">
                {data.map((section) => (
                    <div key={section._id}>
                        <div className="group flex items-center justify-between hover:cursor-pointer hover:bg-stone-50 rounded-md px-2 py-1 h-8">
                            <span className="text-xs font-semibold text-stone-500 group-hover:text-stone-700">{section.name.toUpperCase()}</span>
                            <div className="flex items-center gap-2">

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            type="button" 
                                            className="hover:cursor-pointer hover:bg-stone-200 rounded-full p-1 hidden group-hover:block"
                                            onClick={() => handleAddField(section._id)}
                                        >
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
                        
                        {/* Display fields for this section */}
                        {section.fields && section.fields.length > 0 && (
                            <div className="ml-4 space-y-1 mt-1 mb-2">
                                {section.fields.map(field => (
                                    <div key={field._id} className="text-xs text-stone-500 pl-2 border-l border-stone-200 py-0.5">
                                        {field.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </SummaryBase>
        </>
    )
}