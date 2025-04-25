import SummaryBase from "@/components/summary/summary_base";
import RouteFieldsSectionForm from "@/components/summary/summary_route_fields/sections/section_form";
import FieldForm from "@/components/summary/summary_route_fields/fields/field_form";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRouteFields } from "@/server/routers/get_route_fields";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { routerKeys } from "@/lib/query_keys";
import { Section } from "./components/section";

// Dialog type to track which dialog is currently open
type DialogType = "section" | "field" | null;

// Section type matching the expected type in the section form
type SectionType = { _id: string; name: string };

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

    const handleEditSection = (section: SectionType) => {
        setSelectedSection(section);
        setOpenDialog("section");
    };

    const handleAddField = (sectionId: string) => {
        setSelectedSection({ _id: sectionId });
        setOpenDialog("field");
    };

    const handleDeleteSection = (sectionId: string) => {
        // Implementation to delete a section would go here
        console.log(`Delete section with ID: ${sectionId}`);
    };

    // Helper functions to handle dialog open/close
    const handleSectionDialogChange = (open: boolean) => {
        if (!open) setOpenDialog(null);
    };

    const handleFieldDialogChange = (open: boolean) => {
        if (!open) setOpenDialog(null);
    };

    // Get section data in the correct format for the section form
    const getSectionForForm = (): SectionType | undefined => {
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
                    <Section 
                        key={section._id}
                        section={section}
                        onAddField={handleAddField}
                        onEditSection={handleEditSection}
                        onDeleteSection={handleDeleteSection}
                    />
                ))}
            </SummaryBase>
        </>
    )
}