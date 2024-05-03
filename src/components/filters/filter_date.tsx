'use client'
import * as React from 'react'
import { Calendar } from "../ui/calendar";
import { DateRange } from 'react-day-picker';

export default function DateFilter() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
    return (
        <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
        />
    )
}