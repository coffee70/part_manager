import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { FieldType } from "@/components/ui/icons/icons";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { type Field } from "@/types/collections";
import DeleteRouteField from "../fields/delete_field";

type SectionFieldProps = {
    sectionId: string;
    field: Field;
    onEditField: (field: Field) => void;
};

export function SectionField({ sectionId, field, onEditField }: SectionFieldProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [visibleOptions, setVisibleOptions] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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
        <>

            <DeleteRouteField
                sectionId={sectionId}
                fieldId={field._id}
                open={openDialog}
                onOpenChange={setOpenDialog}
            />

            <div
                className="group flex items-center justify-between p-1 h-8 border-b border-subtle interactive-subtle transition-all duration-200"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                data-testid={`route-fields-field-${field.name}`}
            >
                <div className="flex items-center justify-start space-x-4 ml-1">
                    <div className="py-1">
                        <FieldType type={field.type} size={18} />
                    </div>
                    <div className="py-1 text-xs text-muted group-hover:text-text">
                        {field.name}
                    </div>
                </div>
                <div className="flex items-center justify-center w-8 py-1">
                    <DropdownMenu open={dropdownOpen} onOpenChange={onDropdownOpenChange}>
                        <DropdownMenuTrigger asChild data-testid={`route-fields-field-dropdown-trigger-${field.name}`}>
                            {visibleOptions && <button type="button" className="rounded-full p-0.5 interactive-subtle">
                                <MoreHorizontalIcon className="w-4 h-4" />
                            </button>}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem 
                                className="flex items-center gap-2" 
                                onClick={() => onEditField(field)}
                                data-testid={`route-fields-edit-field-${field.name}`}
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span>Edit Field</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-destructive hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100"
                                onClick={() => setOpenDialog(true)}
                            >
                                <TrashIcon className="w-4 h-4" />
                                <span>Delete Field</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
        </>
    );
} 