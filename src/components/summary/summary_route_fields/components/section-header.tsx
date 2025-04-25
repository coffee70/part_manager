import { ChevronDownIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { SectionActionButton } from "./section-action-button";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
    name: string;
    onAddField: () => void;
    onEditSection: () => void;
    onDeleteSection?: () => void;
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
};

export function SectionHeader({ name, onAddField, onEditSection, onDeleteSection, collapsed, onCollapse }: SectionHeaderProps) {
    return (
        <div 
            className="group flex items-center justify-between hover:cursor-pointer hover:bg-stone-100 rounded-md py-1 px-2 h-8 my-1"
            onClick={() => onCollapse(!collapsed)}
        >
            <div className="flex items-center gap-2">
                <ChevronDownIcon className={cn(
                    "w-4 h-4 transition-transform duration-200 text-stone-500 group-hover:text-stone-700",
                    collapsed ? "-rotate-90" : ""
                )} />
                <span className="text-xs font-semibold text-stone-500 group-hover:text-stone-700">
                    {name.toUpperCase()}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <SectionActionButton 
                    icon={PlusIcon} 
                    label="Add Field" 
                    onClick={onAddField} 
                />
                
                <SectionActionButton 
                    icon={PencilIcon} 
                    label="Edit Section" 
                    onClick={onEditSection} 
                />
                
                {onDeleteSection && (
                    <SectionActionButton 
                        icon={TrashIcon} 
                        label="Delete Section" 
                        onClick={onDeleteSection} 
                    />
                )}
            </div>
        </div>
    );
} 