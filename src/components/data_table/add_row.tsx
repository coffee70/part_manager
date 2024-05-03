'use client'
import React from "react"
import { PlusIcon } from "lucide-react"
import { Input } from "../ui/input";

export default function AddRow({ label }: { label: string }) {
    const [adding, setAdding] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    /**
     * Set up event listener to remove input when it loses focus
     */
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener("blur", () => {
                setAdding(false);
            });
        }
    }, [])

    /**
     * Focus input when adding is true
     */
    React.useEffect(() => {
        if (adding) {
            inputRef.current?.focus();
        }
    }, [adding])

    return adding ? (
        <Input
            ref={inputRef}
            placeholder="Enter order number"
            className="h-10"
        />
    ) : (
        <button
            className="flex items-center p-2 space-x-2 w-full border-x border-b border-border hover:bg-hover"
            onClick={() => setAdding(true)}
        >
            <PlusIcon />
            <span>{label}</span>
        </button>
    )
}