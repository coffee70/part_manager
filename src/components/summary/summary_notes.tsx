'use client'
import React from 'react';
import { Button } from '../ui/button';
import Summary from './summary_base';

export default function SummaryNotes() {
    const [value, setValue] = React.useState<string>('');
    return (
        <Summary title="Notes">
            {/** textarea and edit button */}
            <div>
                <div>{value}</div>
                <button></button>
            </div>
            {/** action buttons */}
            <div className='flex justify-end'>
                <div className='flex space-x-2 w-1/2'>
                        <Button variant='secondary' className='flex-1'>Cancel</Button>
                        <Button className='flex-1'>Save</Button>
                </div>
            </div>
        </Summary>
    )
}