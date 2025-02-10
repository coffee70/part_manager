'use client'
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import ActionButtons from './action_buttons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/server/comments/create_comment';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { commentKeys, instanceKeys } from '@/lib/query_keys';
import { ClickAwayListener } from '@mui/base';
import { useMoreContext } from '../summary_actions/more/more_context';

const PLACEHOLDER = "Add a comment..."

export default function CreateComment() {
    const [showActions, setShowActions] = React.useState(false);
    const [value, setValue] = React.useState("");
    const {
        commentsTextAreaRef: textareaRef
    } = useMoreContext();

    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: commentKeys.all(modelId, instanceId) })
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) });
            setValue("");
            setShowActions(false);
        }
    })

    const handleSave = () => {
        mutate({
            modelId,
            instanceId,
            text: value
        })
    }

    const handleCancel = () => {
        if (textareaRef.current) {
            textareaRef.current.blur();
        }
        setValue("");
        setShowActions(false);
    }

    const handleFocus = () => {
        console.log('focusing');
        setShowActions(true);
    }

    return (
        <ClickAwayListener onClickAway={() => setShowActions(false)}>
            <div className='flex flex-col space-y-2'>
                <Textarea
                    ref={textareaRef}
                    className='px-2 py-1 border border-muted-foreground placeholder:text-muted-foreground'
                    placeholder={PLACEHOLDER}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={handleFocus}
                />
                <ActionButtons
                    onCancel={handleCancel}
                    onSave={handleSave}
                    show={showActions}
                />
            </div>
        </ClickAwayListener>
    )
}