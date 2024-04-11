'use client'
import * as React from 'react'
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { DateRange } from 'react-day-picker'

export default function DateFilter() {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="icon" className='bg-secondary border border-border h-10 w-10'>
                    <CalendarIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                />
            </PopoverContent>
        </Popover>
    )
}