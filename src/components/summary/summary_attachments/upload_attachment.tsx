'use client'
import React from "react";
import { createAttachment } from "@/server/attachments/create_attachment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentKeys, instanceKeys } from "@/lib/query_keys";
import { useInstanceURL } from "@/hooks/url_metadata.hook";

type Props = {
    inputRef: React.RefObject<HTMLInputElement>;
}

export default function UploadAttachment({ inputRef }: Props) {
    const { context, id, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: attachmentKeys.all(context, id, instanceId) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && instanceId) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('id', id);
            formData.append('context', context);
            formData.append('instanceId', instanceId);
            mutate(formData);
        }
    };

    return (
        <input
            id="upload-attachment-input"
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
        />
    );
}