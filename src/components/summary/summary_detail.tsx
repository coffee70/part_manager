'use client'
import React from 'react';
import { ClickAwayListener } from "@mui/base";
import { DetailT } from "./summary_details";
import EditableInput from "../editable_fields/editable_input/editable_input";
import { useFocusContext } from "./summary_details_context";

export default function Detail({ detail }: { detail: DetailT }) {
    const { blur } = useFocusContext();
    const handleClickAway = React.useCallback(() => blur(detail.id), [blur, detail.id])
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div key={detail.id} className="flex items-center justify-between space-x-2 min-w-80">
                <div className='text-muted-foreground text-nowrap'>{`${detail.key}:`}</div>
                <EditableInput detail={detail} />
            </div>
        </ClickAwayListener>
    )
}