import { useState } from "react";
import { SectionField } from "./section-field";
import FieldForm from "../fields/field_form";
import { type Field } from "@/types/collections";

type FieldsContainerProps = {
    fields: Field[];
};

export function FieldsContainer({ fields }: FieldsContainerProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedField, setSelectedField] = useState<Field | undefined>(undefined);

    const handleOpenEditFieldDialog = (field: Field) => {
        setSelectedField(field);
        setOpenDialog(true);
    }

    if (!fields || fields.length === 0) {
        return null;
    }

    return (
        <div className="border border-stone-200 bg-stone-50 rounded-md shadow-sm">

            <FieldForm
                key={`field-form-${selectedField?._id || "new"}`}
                field={selectedField}
                open={openDialog}
                onOpenChange={setOpenDialog}
                sectionId={selectedField?.sectionId || ""}
            />

            {fields.map(field => (
                <SectionField
                    key={field._id}
                    field={field}
                    onEditField={handleOpenEditFieldDialog}
                    onDeleteField={() => { }}
                />
            ))}
        </div>
    );
} 