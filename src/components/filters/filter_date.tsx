'use client'
import * as React from 'react'
import { Calendar } from "../ui/calendar";
import { DateRange } from 'react-day-picker';

type Props = {
    value?: DateRange;
    onChange: (value: DateRange | undefined) => void;
}

export default function DateFilter({ value, onChange }: Props) {
    return (
        <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
        />
    )
}