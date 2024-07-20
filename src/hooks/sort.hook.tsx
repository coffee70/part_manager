'use client'
import React from 'react';

export type SortType = 'asc' | 'desc' | null;

export type SortInfo = {
    label: string;
    type: SortType;
}

export type Sortable = {
    [key: string]: SortInfo;
}

export default function useSort<T extends Sortable>(_sort: T) {
    const [sort, _setSort] = React.useState(_sort);

    const shuffleSort = (s: SortType) => {
        switch (s) {
            case 'asc': return 'desc';
            case 'desc': return null;
            case null: return 'asc';
        }
    }

    const setSort = (k: keyof T) => {
        // for all keys in sort that are not k, set to null without using reduce
        _setSort(prev => Object.keys(prev).reduce((acc, key) => {
            if (key === k) {
                return {
                    ...acc,
                    [key]: {
                        ...prev[key],
                        type: shuffleSort(prev[key].type)
                    }
                };
            }
            return {
                ...acc,
                [key]: {
                    ...prev[key],
                    type: null
                }
            };
        }, prev));

    }

    return { sort, setSort }
}