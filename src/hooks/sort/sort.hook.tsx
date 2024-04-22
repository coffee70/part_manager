'use client'
import React from 'react';

type Sort = 'asc' | 'desc' | null

type SortFields = {
    order_number: Sort
}


export default function useSort() {
    const [sort, setSort] = React.useState<SortFields>({
        order_number: null
    })

    const shuffleSort = (s: Sort) => {
        switch (s) {
            case 'asc': return 'desc';
            case 'desc': return null;
            case null: return 'asc';
        }
    }

    const handleSortChange = (s: Sort) => {
        setSort(prev => ({...prev, s: shuffleSort(s)}))
    }

    return { sort, handleSortChange }
}