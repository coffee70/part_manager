'use client'
import * as React from 'react'
import { Calendar } from "../ui/calendar";
import { useFilterContext } from '@/context/filters/filter.context';

export default function DateFilter() {
    const { dateRange, setDateRange } = useFilterContext();
    return (
        <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
        />
    )
}