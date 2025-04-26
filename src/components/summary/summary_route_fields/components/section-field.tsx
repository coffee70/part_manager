import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { FieldTypeIcon } from "./field-type-icon";
import { type FieldType } from "@/types/collections";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { type Field } from "@/types/collections";

type SectionFieldProps = {
    field: Field;
    onEditField: (field: Field) => void;
    onDeleteField: (field: Field) => void;
};

export function SectionField({ field, onEditField, onDeleteField }: SectionFieldProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [visibleOptions, setVisibleOptions] = useState(false);

    const onDropdownOpenChange = (open: boolean) => {
        setDropdownOpen(open);
        setVisibleOptions(open);
    }

    const onMouseEnter = () => {
        if (!dropdownOpen) {
            setVisibleOptions(true);
        }
    }

    const onMouseLeave = () => {
        if (!dropdownOpen) {
            setVisibleOptions(false);
        }
    }

    return (
        <div 
            className="group flex items-center justify-between p-1 h-8 border-b border-stone-200 hover:bg-stone-200 transition-all duration-200"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center justify-start space-x-4">
                <div className="py-1">
                    <FieldTypeIcon type={field.type} />
                </div>
                <div className="py-1 text-xs text-stone-500 group-hover:text-stone-700">
                    {field.name}
                </div>
            </div>
            <div className="flex items-center justify-center w-8 py-1">
                <DropdownMenu open={dropdownOpen} onOpenChange={onDropdownOpenChange}>
                    <DropdownMenuTrigger asChild>
                        {visibleOptions && <button type="button" className="rounded-full">
                            <MoreHorizontalIcon className="w-4 h-4" />
                        </button>}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => onEditField(field)}>
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit Field</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100" onClick={() => onDeleteField(field)}>
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete Field</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
} 