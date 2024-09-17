'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { CheckIcon, PencilIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ClickAwayListener } from '@mui/base'

export function useIsEditing() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            textareaRef.current?.focus()
        }
    }, [isEditing])

    React.useEffect(() => {
        const _inputRef = inputRef.current;
        const _texareaRef = textareaRef.current;
        _inputRef?.addEventListener('focus' , () => setIsEditing(true))
        _texareaRef?.addEventListener('focus' , () => setIsEditing(true))

        return () => {
            _inputRef?.removeEventListener('focus', () => setIsEditing(false))
            _texareaRef?.removeEventListener('focus', () => setIsEditing(false))
        }
    })

    return {
        inputRef,
        textareaRef,
        isEditing,
        setIsEditing,
    }
}

type Props = {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    error?: boolean;
    errorMessage?: string;
    children?: React.ReactNode;
}

const FieldBase = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
        isEditing,
        setIsEditing,
        loading,
        error,
        errorMessage,
        children,
    } = props

    const formRef = React.useRef<HTMLFormElement>(null);

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <div
                ref={ref}
                className={cn(
                    "group relative flex justify-between border border-transparent",
                    error ? "border-red-500" :
                        loading ? "border-foreground" :
                            isEditing ? "border-foreground" : "hover:border-foreground",
                )}>
                <form ref={formRef} className="grow flex items-center px-1">
                    {children}
                </form>
                <div className="flex flex-col">
                    {error ? (
                        <Error errorMessage={errorMessage} />
                    ) : loading ? (
                        <Loading />
                    ) : (
                        <Button
                            variant='icon'
                            className={cn("grow bg-foreground p-1 rounded-none", !isEditing ? "invisible group-hover:visible" : "")}
                            onClick={() => isEditing ? formRef.current?.requestSubmit() : setIsEditing(true)}
                        >
                            {isEditing ? <CheckIcon /> : <PencilIcon />}
                        </Button>
                    )}
                </div>
            </div>
        </ClickAwayListener>
    )
})

FieldBase.displayName = 'FieldBase'

export default FieldBase

type ButtonProps = {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    formRef: React.RefObject<HTMLFormElement>;
}

const Loading = () => (
    <div className='grow flex items-center p-1 bg-foreground'>
        <LoaderCircleIcon className="animate-spin" />
    </div>
)

const Error = ({ errorMessage }: { errorMessage?: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div className='grow flex items-center p-1 bg-red-500'>
                <TriangleAlertIcon className="text-white" />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className='rounded-sm bg-red-500 p-2'>
                <p className='text-xs text-white font-bold'>{errorMessage}</p>
            </div>
        </TooltipContent>
    </Tooltip>
)

