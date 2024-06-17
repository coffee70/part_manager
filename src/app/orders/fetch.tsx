import { useQuery } from '@tanstack/react-query';
import { Order, Status } from '@prisma/client';
import { DateRange } from 'react-day-picker';

// type the hook should return to the UI
type ReturnType = (Order & { status: Status })[];

type OrderFilter = {
    number: string;
    updatedAt: DateRange;
    statusId: number[];
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

export default function useOrders(filter: OrderFilter) {
    let { data: orders, isLoading, isError } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    });

    if (isLoading || isError || !orders) return { orders: { complete: [], incomplete: [] }, isLoading, isError };

    const { complete, incomplete } = splitByResolution(orders);

    return { orders: { complete, incomplete }, isLoading, isError };
}
