'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import { ClickAwayListener } from '@mui/base'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { useAdminURL } from '@/hooks/url_metadata.hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sectionKeys } from '@/lib/query_keys'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TriangleAlertIcon } from 'lucide-react';
import { useSectionContext } from './section.context'
import { updateSectionName } from '@/server/sections/update_section_name'

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

export default function SectionName() {
    const { section } = useSectionContext();
    const { _id, name } = section;

    const { modelId } = useAdminURL();

    const { isEditing, setIsEditing, inputRef } = useIsEditing();

    const [formState, setFormState] = React.useState({
        name: name,
    })

    const queryClient = useQueryClient();

    const { mutate, isPending, data } = useMutation({
        mutationFn: updateSectionName,
        onSuccess: ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: sectionKeys.all(modelId) })
                setIsEditing(false);
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ _id: _id, ...formState });
    }

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            <form className={cn(
                "group relative flex space-x-1 justify-between border border-transparent pl-1",
                data?.success === false ? "border-red-500" :
                    isPending ? "border-foreground" :
                        isEditing ? "border-foreground" : "hover:border-foreground",
            )}
                onSubmit={handleSubmit}
            >
                <Input
                    id='section-name'
                    ref={inputRef}
                    className='text-2xl font-bold'
                    value={formState.name}
                    onChange={(e) => setFormState({ name: e.target.value })}
                />
                {data?.success === false && <Tooltip>
                    <TooltipTrigger>
                        <TriangleAlertIcon className='text-destructive' size={22} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="bg-destructive p-2 rounded-md">
                            <p className='text-white text-xs font-bold'>{data?.fieldErrors?.name}</p>
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