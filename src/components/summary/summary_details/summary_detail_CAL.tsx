import React from "react";
import { ClickAwayListener } from "@mui/base"
import { useFocusContext } from "./summary_details_context";
import { DetailT } from "./summary_details";

type Props = {
    children: React.ReactElement;
    detail: DetailT;
}

export default function DetailClickAwayListener({ children, detail }: Props) {
    const { blur } = useFocusContext();
    return (
        <ClickAwayListener key={detail.id} onClickAway={() => blur(detail.id)}>
            {/** 
             * This plain div is required as ClickAwayListener's root child 
             * must be an element that can hold a ref.
             */}
            <div>
                {children}
            </div>
        </ClickAwayListener>
    )
}