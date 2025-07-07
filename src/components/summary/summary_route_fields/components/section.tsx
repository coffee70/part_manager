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
};

export function Section({ section, onAddField, onEditSection }: SectionComponentProps) {
    const handleAddField = () => onAddField(section._id);
    const handleEditSection = () => onEditSection({ _id: section._id, name: section.name });

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div data-testid={`route-fields-section-${section.name}`}>
            <SectionHeader
                section={section}
                onAddField={handleAddField}
                onEditSection={handleEditSection}
                collapsed={collapsed}
                onCollapse={setCollapsed}
            />

            {!collapsed && (
                <FieldsContainer
                    sectionId={section._id}
                    fields={section.fields}
                />
            )}
        </div>
    );
} 