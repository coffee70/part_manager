'use client'
import React from 'react';

type Sort = 'asc' | 'desc' | null;

type SortFields = {
    order_number: Sort;
    status: Sort;
    updated_at: Sort;
}

export default function useSort() {
    const [sort, setSort] = React.useState<SortFields>({
        order_number: null,
        status: null,
        updated_at: null,
    })

    const shuffleSort = (s: Sort) => {
        switch (s) {
            case 'asc': return 'desc';
            case 'desc': return null;
            case null: return 'asc';
        }
    }

    const handleSortChange = (k: keyof SortFields) => {
        setSort(prev => {
            const updatedSort = {...prev};
            let key: keyof SortFields;
            for (key in updatedSort) {
                if (key === k) {
                    updatedSort[key] = shuffleSort(prev[key]);
                } else {
                    updatedSort[key] = null;
                }
            }
            return updatedSort;
        })
    }

    return { sort, handleSortChange }
}