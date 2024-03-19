
import { Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./dropdown-menu";

type FilterProps = {
    children: React.ReactNode;
}
function Filter({ children }: FilterProps) {
    return <DropdownMenu>{children}</DropdownMenu>
}

type FilterTriggerProps = {
    children: React.ReactNode;
}

function FilterTrigger({ children }: FilterTriggerProps) {
    return (
        <DropdownMenuTrigger asChild>
            <button
                className="w-min bg-foreground border border-border text-black p-2"
            >{children}</button>
        </DropdownMenuTrigger>
    )
}

type FilterContentProps = {
    children: React.ReactNode;
}

function FilterContent({ children }: FilterContentProps) {
    return (
        <DropdownMenuContent className="w-56">
            {children}
        </DropdownMenuContent>
    )
}