import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import React from "react";

type SectionActionButtonProps = {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
};

export function SectionActionButton({ icon: Icon, label, onClick }: SectionActionButtonProps) {

    const _onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick && onClick();
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button 
                    type="button" 
                    className="hover:cursor-pointer hover:bg-stone-200 rounded-full p-1 hidden group-hover:block"
                    onClick={_onClick}
                >
                    <Icon className="w-4 h-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="bg-black text-white text-xs px-2 py-1.5 rounded-md">
                    <span>{label}</span>
                </div>
            </TooltipContent>
        </Tooltip>
    );
} 