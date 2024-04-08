'use client'
import React from "react";
import { ClickAwayListener } from "@mui/base"
import { useFocusContext } from "./summary_details_context";
import { DetailT } from "./summary_details";

type Props = {
    children: React.ReactNode;
    detail: DetailT;
}

export default function DetailBase({ children, detail }: Props) {
    return (
        <div className="flex items-center justify-between space-x-2 min-w-80 min-h-9">
            <div className='text-muted-foreground text-nowrap'>{`${detail.key}:`}</div>
            {children}
        </div>
    )
}