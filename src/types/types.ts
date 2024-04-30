import { LucideIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export type Order = {
    id: number;
    label: string;
    sublabel?: string;
    status: Status;
    updated?: {
        at: string;
        by: string;
    };
    archived?: {
        at: string;
        by: string;
    }
}

export type Status = {
    id: number;
    label: string;
    color: string;
    completed: boolean;
}

export type Filters = {
    search: string;
    dateRange: DateRange | undefined;
    statusIds: number[];
    showArchived: boolean;
}

export type Icon = LucideIcon;

export type IconProps = React.ComponentProps<Icon>;

export type Priority = {
    label: string;
    color: string;
    Icon: React.ComponentType<IconProps>;
}