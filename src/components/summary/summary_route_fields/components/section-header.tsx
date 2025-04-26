import { ChevronDownIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { SectionActionButton } from "./section-action-button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

type SectionHeaderProps = {
    name: string;
    onAddField: () => void;
    onEditSection: () => void;
    onDeleteSection?: () => void;
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
};

export function SectionHeader({ name, onAddField, onEditSection, onDeleteSection, collapsed, onCollapse }: SectionHeaderProps) {
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

    const onClick = (e: React.MouseEvent<HTMLDivElement>, callback?: () => void) => {
        e.stopPropagation();
        callback && callback();
    }
    
    return (
        <div
            className={cn(
                "group flex items-center justify-between hover:cursor-pointer hover:bg-stone-100 rounded-md py-1 px-2 h-8 my-1",
                visibleOptions && "bg-stone-100"
            )}
            onClick={() => onCollapse(!collapsed)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center gap-2">
                <ChevronDownIcon className={cn(
                    "w-4 h-4 transition-transform duration-200 text-stone-500 group-hover:text-stone-700",
                    collapsed ? "-rotate-90" : "",
                    visibleOptions && "text-stone-700"
                )} />
                <span className={cn(
                    "text-xs font-semibold text-stone-500 group-hover:text-stone-700",
                    visibleOptions && "text-stone-700"
                )}>
                    {name.toUpperCase()}
                </span>
            </div>
            <DropdownMenu open={dropdownOpen} onOpenChange={onDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                    {visibleOptions && <button type="button" className="rounded-full p-0.5 mr-1 hover:bg-stone-300">
                        <MoreHorizontalIcon className="w-4 h-4" />
                    </button>}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={(e) => onClick(e, onAddField)}
                        className="flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Field</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => onClick(e, onEditSection)}
                        className="flex items-center gap-2"
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit Section</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => onClick(e, onDeleteSection)}
                        className="flex items-center gap-2 text-destructive hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete Section</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 