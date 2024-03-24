"use client"

import * as React from "react"
import { CssTransition, SelectProvider, useOption } from "@mui/base"
import StatusIcon from "./svg/status_icon"
import { Button } from "./ui/button"
import clsx from "clsx"
import StatusIndicator from "./svg/status_indicator"
import { useSelect } from "@mui/base"
import { Check as CheckIcon } from "lucide-react"

interface ListboxProps
    extends React.HTMLAttributes<HTMLUListElement> {
    children: React.ReactNode;
}

type OptionProps = {
    value: number;
    status: {
        label: string;
        color: string;
    };
    className?: string;
    disabled?: boolean;
}

function Option(props: OptionProps) {
    const { value, status, className, disabled = false } = props;
    const { getRootProps, highlighted, selected } = useOption({
        value,
        disabled,
        label: status.label,
    })

    return (
        <li
            {...getRootProps()}
            className={clsx(
                "flex items-center space-x-3 p-2 cursor-pointer bg-transparent text-text text-sm hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary",
                className
            )}
        >
            <StatusIndicator color={status.color} height={8} width={8} />
            <span>{status.label}</span>
            <CheckIcon className={clsx("!ml-auto", selected ? "" : "invisible")} strokeWidth={1.5} size={20}/>
        </li>
    )
}

export default function StatusFilter() {
    const { statuses, handleStatusChange } = useStatuses()
    const listboxRef = React.useRef(null);
    const [listboxVisible, setListboxVisible] = React.useState(false);

    const { getButtonProps, getListboxProps, contextValue, value } = useSelect({
        listboxRef,
        onOpenChange: setListboxVisible,
        open: listboxVisible,
        multiple: true,
    });

    return (
        <div className="relative p-2">
            <Button {...getButtonProps()} variant="icon" size="icon" className="relative">
                <StatusIcon width={24} height={24} />
            </Button>
            <ul
                {...getListboxProps()}
                className={clsx(
                    "absolute h-auto w-full min-w-56 z-10 list-none bg-foreground text-text border border-border p-1 my-1 shadow-sm",
                    listboxVisible ? "" : "hidden"
                )}
                aria-hidden={!listboxVisible}
            >
                <SelectProvider value={contextValue}>
                    {statuses.map(status => (
                        <Option key={status.id} value={status.id} status={status} />
                    ))}
                </SelectProvider>
            </ul>
        </div>
    )
}

function useStatuses() {
    const [statuses, setStatuses] = React.useState([
        { id: 0, label: "Open", color: "green", checked: false },
        { id: 1, label: "Closed", color: "red", checked: false },
        { id: 2, label: "In Progress", color: "yellow", checked: false },
    ])

    const handleStatusChange = (id: number) => {
        setStatuses(
            statuses.map((status) =>
                status.id === id ? { ...status, checked: !status.checked } : status
            )
        )
    }

    return { statuses, handleStatusChange }

}