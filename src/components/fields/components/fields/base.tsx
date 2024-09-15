'use client'
import React, { Ref } from 'react'
import { Button as BaseButton } from "@/components/ui/button"
import { CheckIcon, PencilIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ClickAwayListener } from '@mui/base'

export type InputRefType = {
    refs: React.RefObject<HTMLInputElement>[];
}

type Props = {
    inputRefs: React.RefObject<InputRefType>;
    formRef: React.RefObject<HTMLFormElement>;
    loading?: boolean
    error?: boolean
    errorMessage?: string
    children: React.ReactElement;
}

export default function FieldBase(props: Props) {
    const {
        inputRefs,
        formRef,
        loading,
        error,
        errorMessage,
        children
    } = props

    const [isEditing, setIsEditing] = React.useState(false);

    // check if any input ref is focused
    const checkFocus = React.useCallback(() => {
        const refs = inputRefs?.current?.refs;
        const isAnyRefFocused = refs?.some((ref) => {
            const isRefFocused = ref.current?.contains(document.activeElement);
            return isRefFocused;
        }) || false;

        setIsEditing(isAnyRefFocused);
    }, [inputRefs]);

    // add focus event listeners to all input refs
    React.useEffect(() => {
        const refs = inputRefs?.current?.refs;
        // add event listeners
        refs?.forEach((ref) => {
            ref.current?.addEventListener('focus', checkFocus);
        })

        return () => {
            // remove event listeners
            refs?.forEach((ref) => {
                ref.current?.removeEventListener('focus', checkFocus);
            })
        }
    }, [inputRefs, checkFocus]);

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <div
                className={cn(
                    "group relative flex justify-between border border-transparent",
                    error ? "border-red-500" :
                        loading ? "border-foreground" :
                            isEditing ? "border-foreground" : "hover:border-foreground",
                )}>
                <div className="grow flex items-center px-1">
                    {children}
                </div>
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
        <LoaderCircleIcon size={20} className="animate-spin" />
    </div>
)

const Error = ({ errorMessage }: { errorMessage?: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div className='grow flex items-center p-1 bg-red-500'>
                <TriangleAlertIcon size={20} className="text-white" />
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className='rounded-sm bg-red-500 p-2'>
                <p className='text-xs text-white font-bold'>{errorMessage}</p>
            </div>
        </TooltipContent>
    </Tooltip>
)

