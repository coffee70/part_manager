import { Filters } from "@/types/types";

export type TData = Array<{
    id: number;
    label: string;
    sublabel?: string;
    status: {
        label: string;
        color: string;
        completed?: boolean;
    };
    updated?: {
        at: string;
        by: string;
    };
}>

export function fetchOrderData(filters: Filters) {
    const complete = orderData.filter(order => order.status.completed)
    const incomplete = orderData.filter(order => !order.status.completed)

    return { complete, incomplete }
}

const orderData = [
    {
        id: 1,
        label: "O-932049",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Needs Approval",
            color: "red",
            completed: false,
        },
        updated: {
            at: "2024-01-12T12:00:00Z",
            by: "Emily Skarski",
        },
    },
    {
        id: 2,
        label: "O-932050",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Completed",
            color: "green",
            completed: true,
        },
        updated: {
            at: "2024-03-24T12:00:00Z",
            by: "Dean Applebaum",
        },
    },
    {
        id: 3,
        label: "O-932051",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "In Progress",
            color: "#D6C100",
            completed: false,
        },
        updated: {
            at: "2010-09-01T12:00:00Z",
            by: "Francis MacDonald",
        },
    },
    {
        id: 4,
        label: "O-932052",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Needs Approval",
            color: "red",
            completed: false,
        },
        updated: {
            at: "2023-09-01T12:00:00Z",
            by: "James Eagleton",
        },
    },
    {
        id: 5,
        label: "O-932053",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Approved",
            color: "green",
            completed: false,
        },
        updated: {
            at: "2022-09-01T12:00:00Z",
            by: "Perry Smith",
        },
    },
    {
        id: 6,
        label: "O-932054",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "In Progress",
            color: "#D6C100",
            completed: false,
        },
        updated: {
            at: "2021-09-01T12:00:00Z",
            by: "Jane Doe",
        },
    },
    {
        id: 7,
        label: "O-932055",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Needs Approval",
            color: "red",
            completed: false,
        },
        updated: {
            at: "2021-09-01T12:00:00Z",
            by: "Peter Kowalski",
        },
    },
    {
        id: 8,
        label: "O-932056",
        sublabel: "Order from 2021-09-01",
        status: {
            label: "Completed",
            color: "green",
            completed: true
        },
        updated: {
            at: "2022-10-01T12:00:00Z",
            by: "Janine Petrov",
        },
    }
]