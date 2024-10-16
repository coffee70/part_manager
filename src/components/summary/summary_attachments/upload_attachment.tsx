'use client'
import React from "react";
import { createAttachment } from "@/server/attachments/create_attachment";
import { useAttachmentCollection } from "@/hooks/attachment_collection.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentCollection } from "@/types/collections";
import { collectionKeys } from "@/lib/query_keys";
import { useURLMetadata } from "@/hooks/url_metadata.hook";

type FormState = {
    file: File | null;
    collection: AttachmentCollection;
    modelId: string | null;
}

type Props = {
    inputRef: React.RefObject<HTMLInputElement>;
}

export default function UploadAttachment({ inputRef }: Props) {
    const { id } = useURLMetadata();
    const attachmentCollection = useAttachmentCollection();

    const [formState, setFormState] = React.useState<FormState>({
        file: null,
        collection: attachmentCollection,
        modelId: id,
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createAttachment,
        onSuccess: () => {
            console.log('Attachment created');
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(attachmentCollection, id) }); // Invalidate queries to refresh data
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFormState(prevState => ({ ...prevState, file }));
            mutate({ ...formState, file });
        }
    }

    return (
        <form>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />
        </form>
    );
}