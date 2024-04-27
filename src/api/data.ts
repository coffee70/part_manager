import { Filters, Status, Priority } from "@/types/types";
import { ChevronsUpIcon, ChevronsDownIcon, ChevronUpIcon, ChevronDownIcon, MinusIcon } from "lucide-react";

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

export function fetchOrders(filters: Filters) {
    const complete = orderData.filter((order) => {
        if (filters.search) {
            const search = filters.search.toLowerCase()
            if (
                !order.label.toLowerCase().includes(search) &&
                !order.sublabel?.toLowerCase().includes(search)
            ) {
                return false
            }
        }

        return true
    }).filter(order => order.status.completed)

    const incomplete = orderData.filter((order) => {
        if (filters.search) {
            const search = filters.search.toLowerCase()
            if (
                !order.label.toLowerCase().includes(search) &&
                !order.sublabel?.toLowerCase().includes(search)
            ) {
                return false
            }
        }

        return true
    }).filter(order => !order.status.completed)

    return { complete, incomplete }
}

const orderData = [
    {
        id: 1,
        label: "O-932049",
        sublabel: "Order from 2021-09-01",
        status: {
            id: 3,
            label: "Needs Approval",
            color: "red",
            completed: false,
        },
        updated: {
            at: "2024-01-12T12:00:00Z",
            by: "Emily Skarski",
        },
        archived: undefined
    },
    {
        id: 2,
        label: "O-932050",
        sublabel: "Order from 2021-09-01",
        status: {
            id: 4,
            label: "Completed",
            color: "green",
            completed: true,
        },
        updated: {
            at: "2024-03-24T12:00:00Z",
            by: "Dean Applebaum",
        },
        archived: {
            at: "2024-03-24T12:00:00Z",
            by: "Dean Applebaum",
        }
    },
    {
        id: 3,
        label: "O-932051",
        sublabel: "Order from 2021-09-01",
        status: {
            id: 2,
            label: "In Progress",
            color: "#f39c11",
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
            id: 3,
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
            id: 2,
            label: "In Progress",
            color: "#f39c11",
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
            id: 2,
            label: "In Progress",
            color: "#f39c11",
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
            id: 3,
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
            id: 4,
            label: "Completed",
            color: "green",
            completed: true
        },
        updated: {
            at: "2022-10-01T12:00:00Z",
            by: "Janine Petrov",
        },
        archived: {
            at: "2024-03-24T12:00:00Z",
            by: "Dean Applebaum",
        }
    }
]

const statuses: Status[] = [
    {
        id: 4,
        label: "Completed",
        color: "green",
        completed: true
    },
    {
        id: 3,
        label: "Needs Approval",
        color: "red",
        completed: false,
    },
    {
        id: 2,
        label: "In Progress",
        color: "#f39c11",
        completed: false,
    },
]

export const fetchStatusData = () => statuses

const details = [
    {
      id: 0,
      label: "Name",
      value: "John Brown",
    },
    {
      id: 1,
      label: "Address",
      value: "248 Cyber Lane",
    },
    {
      id: 2,
      label: "City/Town",
      value: "Leesburg",
    },
    {
      id: 3,
      label: "Zip Code",
      value: "20176",
    },
    {
      id: 4,
      label: "Email",
      value: "john.brown@leesburg.com",
    },
  ]
  
  const people = [
    {
      id: 0,
      label: "Person 1",
      value: {
        name: "John Brown",
      },
    },
    {
      id: 1,
      label: "Person 2",
      value: {
        name: "Jane Doe",
      },
    },
    {
      id: 2,
      label: "Person 3",
      value: {
        name: "John Doe",
      },
    },
  ]
  
  const partData: TData = [
    {
      id: 0,
      label: "P-192",
      status: {
        label: "In Progress",
        color: "#f39c11",
        completed: false,
      },
      updated: {
        at: "2021-09-01T12:00:00Z",
        by: "John Brown",
      },
    },
    {
      id: 1,
      label: "P-334",
      status: {
        label: "Needs Approval",
        color: "red",
        completed: false,
      },
      updated: {
        at: "2021-09-01T12:00:00Z",
        by: "Jane Doe",
      },
    },
    {
      id: 2,
      label: "P-092",
      status: {
        label: "Approved",
        color: "green",
        completed: false,
      },
      updated: {
        at: "2021-09-01T12:00:00Z",
        by: "John Doe",
      },
    }
  ]

export const fetchOrder = () => {
    return {
        orderNumber: "O-23344",
        customer: "Lockheed Martin",
        details: details,
        people: people,
        partData: partData
    }
}

const priorities: Priority[] = [
  { label: "Highest", color: "#ff0000", Icon: ChevronsUpIcon },
  { label: "High", color: "#fc4949", Icon: ChevronUpIcon },
  { label: "Medium", color: "#f39c11", Icon: MinusIcon },
  { label: "Low", color: "#5cbd02", Icon: ChevronDownIcon },
  { label: "Lowest", color: "#02bd15", Icon: ChevronsDownIcon },
]

export const fetchPriorities = () => priorities