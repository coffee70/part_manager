'use client'
import React from 'react';

export type SortOption = 'asc' | 'desc' | null;

type Props<T> = {
    sort: T;
}

export default function useSort<T extends { [key: string]: SortOption }>({ sort }: Props<T>) {
    const [state, setState] = React.useState<T>(sort);

    const shuffleSort = (s: SortOption) => {
        switch (s) {
            case 'asc': return 'desc';
            case 'desc': return null;
            case null: return 'asc';
        }
    }

const setSort = (k: keyof T) => {
    // for all keys in sort that are not k, set to null without using reduce
    setState(prev => Object.keys(prev).reduce((acc, key) => {
        if (key === k) {
            return { ...acc, [key]: shuffleSort(prev[key]) };
        }
        return { ...acc, [key]: null };
    }, prev));

}

    return { sort, setSort }
}