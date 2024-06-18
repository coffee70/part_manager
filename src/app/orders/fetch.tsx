import { useQuery } from '@tanstack/react-query';
import { Order, Status } from '@prisma/client';
import { DateRange } from 'react-day-picker';
import { SortOption } from '@/hooks/sort.hook';

// type the hook should return to the UI
type ReturnType = (Order & { status: Status })[];

type OrderFilter = {
    number: string;
    updatedAt: DateRange;
    statusId: number[];
}

type OrderSort = {
    number: SortOption;
    updatedAt: SortOption;
    statusId: SortOption;
}

type Props = {
    filters: OrderFilter;
    sort: OrderSort;
}

export default function useOrders({ filters, sort }: Props) {
    let { data: orders, isLoading, isError } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    });

    if (isLoading || isError || !orders) return { orders: { complete: [], incomplete: [] }, isLoading, isError };

    orders = filterOrders(orders, filters);
    orders = sortOrders(orders, sort);
    const { complete, incomplete } = splitByResolution(orders);

    return { orders: { complete, incomplete }, isLoading, isError };
}

async function getOrders() {
    // Fetch orders and statuses
    let data = await fetch('/api/orders');
    const orders: ReturnType = await data.json();
    data = await fetch('/api/statuses');
    const statuses: Status[] = await data.json();

    // Assign status to each order
    orders.map(order => {
        const status = statuses.find(status => status.id === order.statusId);
        if (status) order.status = status;
        return order;
    })

    return orders;
}

function filterOrders(orders: ReturnType, filter: OrderFilter) {
    const { number, updatedAt, statusId } = filter;
    return orders.filter((order) => {
        if (number && !order.number.includes(number)) return false;
        if (updatedAt?.from) {
            if (order.updatedAt < updatedAt.from) return false;
        }
        if (updatedAt?.to) {
            if (order.updatedAt > updatedAt.to) return false;
        }
        if (statusId && !statusId.includes(order.statusId)) return false;
        return true;
    });
}

function sortOrders(orders: ReturnType, sort: OrderSort) {
    return orders.sort((a, b) => {
        if (sort.number === 'asc') {
            return a.number.localeCompare(b.number);
        } else if (sort.number === 'desc') {
            return b.number.localeCompare(a.number);
        }

        if (sort.updatedAt === 'asc') {
            return a.updatedAt.getTime() - b.updatedAt.getTime();
        } else if (sort.updatedAt === 'desc') {
            return b.updatedAt.getTime() - a.updatedAt.getTime();
        }

        if (sort.statusId === 'asc') {
            return a.status.label.localeCompare(b.status.label);
        } else if (sort.statusId === 'desc') {
            return b.status.label.localeCompare(a.status.label);
        }

        return 0;
    })
}

function splitByResolution(orders: ReturnType) {
    const complete: ReturnType = [];
    const incomplete: ReturnType = [];
    return orders.reduce((acc, order) => {
        if (order.status.resolved) {
            acc.complete.push(order);
        } else {
            acc.incomplete.push(order);
        }
        return acc;
    }, { complete: complete, incomplete: incomplete });
}
