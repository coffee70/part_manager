'use client'
import { Field } from "@/types/collections";
import { SectionHeader } from "./section-header";
import { FieldsContainer } from "./fields-container";
import { useState } from "react";


export type SectionProps = {
    _id: string;
    name: string;
    fields: Field[];
};

type SectionComponentProps = {
    section: SectionProps;
    onAddField: (sectionId: string) => void;
    onEditSection: (section: { _id: string; name: string }) => void;
    onDeleteSection?: (sectionId: string) => void;
};

export function Section({ section, onAddField, onEditSection, onDeleteSection }: SectionComponentProps) {
    const handleAddField = () => onAddField(section._id);
    const handleEditSection = () => onEditSection({ _id: section._id, name: section.name });
    const handleDeleteSection = onDeleteSection ? () => onDeleteSection(section._id) : undefined;

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div>
            <SectionHeader 
                name={section.name}
                onAddField={handleAddField}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
                collapsed={collapsed}
                onCollapse={setCollapsed}
            />
            
            {!collapsed && <FieldsContainer fields={section.fields} />}
        </div>
    );
} 