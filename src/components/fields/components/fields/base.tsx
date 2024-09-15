'use client'
import React from 'react'
import { Button as BaseButton } from "@/components/ui/button"
import { CheckIcon, PencilIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ClickAwayListener } from '@mui/base'

type Props = {
    inputRef?: React.RefObject<HTMLInputElement>;
    textareaRef?: React.RefObject<HTMLTextAreaElement>;
    loading?: boolean
    error?: boolean
    errorMessage?: string
    children: React.ReactElement;
}

export default function FieldBase(props: Props) {
    const {
        inputRef,
        textareaRef,
        loading,
        error,
        errorMessage,
        children
    } = props

    const formRef = React.useRef<HTMLFormElement>(null);

    const [isEditing, setIsEditing] = React.useState(false);

    // add focus event listeners to all input refs
    React.useEffect(() => {
        const _inputRef = inputRef?.current;
        const _textareaRef = textareaRef?.current;

        // add event listeners
        _inputRef?.addEventListener('focus', () => setIsEditing(true));
        _textareaRef?.addEventListener('focus', () => setIsEditing(true));

        return () => {
            // remove event listeners
            _inputRef?.removeEventListener('focus', () => setIsEditing(true));
            _textareaRef?.removeEventListener('focus', () => setIsEditing(true));
        }
    }, [inputRef, textareaRef]);

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <div
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
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            formRef={formRef}
                        />
                    )}
                </div>
            </div>
        </ClickAwayListener>
    )
}


type ButtonProps = {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    formRef: React.RefObject<HTMLFormElement>;
}

const Button = ({ isEditing, setIsEditing, formRef }: ButtonProps) => {
    return (
        <BaseButton
            variant='icon'
            className={cn("grow bg-foreground p-1 rounded-none", !isEditing ? "invisible group-hover:visible" : "")}
            onClick={() => isEditing ? formRef.current?.requestSubmit() : setIsEditing(true)}
        >
            {isEditing ? <CheckIcon /> : <PencilIcon />}
        </BaseButton>
    )
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

