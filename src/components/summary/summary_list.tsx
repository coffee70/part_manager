'use client'
import * as React from 'react';
import { TData } from "@/api/orderData";
import Summary from "./summary_base";
import Badge from "../ui/badge";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Input } from "../ui/input";

const PLACEHOLDER = 'Enter order number'

type Props = {
    title: string;
    data: TData;
    addLabel: string;
}

export default function SummaryList({ title, data, addLabel }: Props) {
    const [adding, setAdding] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleAdd = React.useCallback(() => {
        setAdding(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [inputRef]);

    return (
        <Summary title={title}>
            <div className='flex flex-col last:border-b last:border-foreground'>
                {data.map(point => (
                    <div key={point.id} className='flex items-center justify-between border-t border-foreground'>
                        {/** label */}
                        <div>{point.label}</div>
                        {/** status and more button */}
                        <div className='flex items-center space-x-2'>
                            <Badge color={point.status.color} label={point.status.label} />
                            <Button variant='table' size='sm_icon'>
                                <MoreHorizontalIcon />
                            </Button>
                        </div>
                    </div>
                ))}
                <div className='flex items-center border-t border-foreground h-8'>
                    {adding ? (
                        <Input
                            ref={inputRef}
                            placeholder={PLACEHOLDER}
                            onBlur={() => setAdding(false)}
                        />
                    ) : (
                        <button className="flex items-center space-x-1 w-full text-muted-foreground"
                            onClick={handleAdd}>
                            <PlusIcon />
                            <span>{addLabel}</span>
                        </button>
                    )}
                </div>
            </div>
        </Summary>
    )
}