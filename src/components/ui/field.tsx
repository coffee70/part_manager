'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckIcon, PencilIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string
    loading?: boolean
    onFormSubmit?: () => void
}

export default function Field({ loading, onFormSubmit, ...props }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
        }
        if (!isEditing) {
            inputRef.current?.blur()
        }
    }, [isEditing])

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <div className={cn(
                "group flex border border-transparent pl-1",
                !isEditing ? "hover:border-foreground" : "hover:border-muted-foreground",
                isEditing ? "border-muted-foreground" : "",
                loading ? "border-foreground" : ""
            )}>
                <Input
                    {...props}
                    ref={inputRef}
                    onFocus={() => setIsEditing(true)}
                    disabled={loading}
                />
                {loading ? (
                    <div className='flex items-center w-8 h-8 p-1 bg-foreground'>
                        <LoaderCircleIcon size={20} className="animate-spin" />
                    </div>
                ) : (
                    <>
                        {!isEditing && (
                            <Button
                                variant='icon'
                                className="bg-foreground p-1 rounded-none invisible group-hover:visible"
                                onClick={() => setIsEditing(true)}
                            >
                                <PencilIcon />
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                variant='icon'
                                className="bg-foreground p-1 rounded-none"
                                onClick={onFormSubmit}
                            >
                                <CheckIcon />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </ClickAwayListener>
    )
}