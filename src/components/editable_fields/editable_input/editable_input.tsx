'use client'
import * as React from 'react';
import { InputProps } from '@/components/ui/input';
import Focused from './focused_editable_input';
import NotFocused from './not_focused_editable_input';
import { useFocusContext } from '@/components/summary/summary_details/summary_details_context';
import { DetailT } from '@/components/summary/summary_details/summary_details';

interface Props extends InputProps { detail: DetailT }

export default function EditableInput({ detail, ...other }: Props) {
    const { focused } = useFocusContext();
    const isFocused = focused.find(f => f.id === detail.id)?.focused;
    return (
        <>
            {isFocused && <Focused detail={detail} {...other}/>}
            {!isFocused && <NotFocused detail={detail} />}
        </>
    )
}