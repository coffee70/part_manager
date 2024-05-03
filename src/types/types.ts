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
    };
    customer: Customer;
}

export type Customer = {
    id: number;
    name: string;
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

export type Detail = {
    id: number;
    label: string;
    value: string;
}

export type SummaryListItemData = {
    id: number;
    label: string;
    status: {
        label: string;
        color: string;
        completed?: boolean;
    };
}

export type Person = {
    id: number;
    name: string;
}

export type PersonAction = {
    id: number;
    label: string;
    person: Person;
}

export type Part = {
    id: number;
    label: string;
    status: Status;
    updated: {
        at: string;
        by: string;
    };
}

