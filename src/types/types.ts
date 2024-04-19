export type Status = {
    id: number;
    label: string;
    color: string;
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