'use client'
import React from "react";
import { createAttachment } from "@/server/attachments/create_attachment";
import { useAttachmentCollection } from "@/hooks/attachment_collection.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/query_keys";
import { useURLMetadata } from "@/hooks/url_metadata.hook";

type Props = {
    inputRef: React.RefObject<HTMLInputElement>;
}

export default function UploadAttachment({ inputRef }: Props) {
    const { id } = useURLMetadata();
    const attachmentCollection = useAttachmentCollection();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(attachmentCollection, id) });
            // updates the table view to show the updated at date change
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(attachmentCollection) });
        },
        onError: (error) => {
            console.error(error);
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && id) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('collection', attachmentCollection);
            formData.append('modelId', id);
            mutate(formData);
        }
    };

    return (
        <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
        />
    );
}