import { LucideIcon } from "lucide-react";

export type Status = {
    id: number;
    label: string;
    color: string;
    completed: boolean;
}

export type Filters = {
    search: string;
    dateRange: {
        start: string;
        end: string;
    };
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