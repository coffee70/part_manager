'use client'
import { useRouterHelpers } from '@/lib/search_params';
import { useSearchParams } from 'next/navigation';

export type SortType = 'asc' | 'desc' | undefined;

export type SortInfo = {
    label: string;
    type?: SortType;
}

export type Sortable = {
    [key: string]: SortInfo;
}

export default function useSort<T extends Sortable>(sort: T) {
    const { pushSearchParams } = useRouterHelpers();
    const searchParams = useSearchParams();
    const sort_by = searchParams.get('sort_by');
    const sort_order = searchParams.get('sort_order');

    if (sort_by && sort_by in sort) {
        sort[sort_by].type = sort_order as SortType;
    }

    const shuffleSort = (s: SortType) => {
        switch (s) {
            case 'asc': return 'desc';
            case 'desc': return undefined;
            case undefined: return 'asc';
        }
    }

    const setSort = (k: keyof T) => {
        const type = shuffleSort(sort[k].type);
        if (type === undefined) {
            pushSearchParams({
                sort_by: undefined,
                sort_order: undefined
            });
        } else {
            pushSearchParams({
                sort_by: k.toString(),
                sort_order: type
            });
        }
    }

    return { sort, setSort }
}