'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { useInstanceURL } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { instanceKeys } from '@/lib/query_keys'
import { Input } from '@/components/ui/input'
import { updateNumber } from '@/server/number/update_number'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TriangleAlertIcon } from 'lucide-react';

function useIsEditing() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
        }
    }, [isEditing])

    React.useEffect(() => {
        const _textareaRef = inputRef.current;
        _textareaRef?.addEventListener('focus', () => setIsEditing(true))

        return () => {
            _textareaRef?.removeEventListener('focus', () => setIsEditing(false))
        }
    })

    return {
        inputRef,
        isEditing,
        setIsEditing,
    }
}

type Props = {
    initialValue?: string;
}

export default function Number({ initialValue }: Props) {

    /** 
     * updating using the form will not cause the notes
     * to re-render with the new initialValue so we need to
     * update the value when the initialValue changes
     */
    // TODO: find a better way to handle this
    React.useEffect(() => {
        setValue(initialValue ?? '')
    }, [initialValue])

    const [value, setValue] = React.useState(initialValue ?? '');

    const { context, id, instanceId } = useInstanceURL();

    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    const queryClient = useQueryClient();

    const { mutate, isPending, data } = useMutation({
        mutationFn: updateNumber,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: instanceKeys.id(context, id, instanceId) })
                queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
                setIsEditing(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            id,
            instanceId,
            number: value
        })
    }

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <form className={cn(
                "group relative flex space-x-1 justify-between border border-transparent pl-1",
                data?.success === false ? "border-destructive" :
                    isPending ? "border-subtle" :
                        isEditing ? "border-subtle" : "hover:border-subtle",
            )}
                onSubmit={handleSubmit}
            >
                <Input
                    ref={inputRef}
                    className='text-3xl font-bold'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    data-testid="summary-number-input"
                />
                {data?.success === false && <Tooltip>
                    <TooltipTrigger>
                        <TriangleAlertIcon className='text-destructive' size={22} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="bg-destructive p-2 rounded-md">
                            <p className='text-destructive-text text-xs font-bold'>{data?.fieldErrors?.number}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>}
                <div className="flex flex-col">
                    {isPending ? (
                        <Loading />
                    ) : isEditing || data?.success === false ? (
                        <Editing error={data?.success === false} />
                    ) : (
                        <NotEditing onClick={() => setIsEditing(true)} />
                    )}
                </div>
            </form>
        </ClickAwayListener>
    )
}