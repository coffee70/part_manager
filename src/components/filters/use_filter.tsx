'use client'
import React from 'react';

type Props<T> = {
    filters: T;
}

export default function useFilter<T>({ filters }: Props<T>) {
    const [state, setState] = React.useState<T>(filters);

    const setFilters = (key: keyof T, value: any) => {
        setState((prev) => ({ ...prev, [key]: value }));
    }

    return { filters: state, setFilters };
}