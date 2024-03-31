'use client'
import React from 'react';
import { Button } from '../ui/button';
import Summary from './summary_base';
import { PencilIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';

import { cn } from '@/lib/utils';
import { set } from 'date-fns';

const PLACEHOLDER = 'Click to add notes';

export default function SummaryNotes() {
    const [value, setValue] = React.useState<string>('');
    const [hovered, setHovered] = React.useState<boolean>(false);
    const [focused, setFocused] = React.useState<boolean>(false);

    const handleFocus = React.useCallback(() => {
        setFocused(true);
        setHovered(false);
    }, []);

    const handleBlur = React.useCallback(() => setFocused(false), []);

    const handleSubmit = React.useCallback(() => {
        // POST request to save notes
        setFocused(false);
    }, []);

    return (
        <Summary title="Notes">
            {/** textarea and edit button */}
            <div
                className={cn('flex border', hovered && !focused ? 'border-foreground' : 'border-transparent')}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur} 
                    placeholder={PLACEHOLDER}
                ></Textarea>
                <button
                    className={cn('bg-foreground p-1', hovered && !focused ? 'visible' : 'invisible')}
                    onClick={handleFocus}
                >
                    <PencilIcon />
                </button>
            </div>
            {/** action buttons */}
            {focused && <div className='flex justify-end'>
                <div className='flex space-x-2 w-1/2'>
                    <Button
                        variant='secondary'
                        className='flex-1'
                        onClick={() => setFocused(false)}
                    >Cancel</Button>
                    <Button
                        className='flex-1'
                        onClick={handleSubmit}
                    >Save</Button>
                </div>
            </div>}
        </Summary>
    )
}