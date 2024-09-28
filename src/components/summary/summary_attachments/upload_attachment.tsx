'use client'
import React from "react";
import { PlusIcon } from "lucide-react";
import { createAttachment } from "@/server/attachments/create_attachment";
import { useAttachmentCollection } from "@/hooks/attachment_collection.hook";
import { ObjectId } from "mongodb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentCollection } from "@/types/collections";
import { collectionKeys } from "@/lib/query_keys";
import { useURLMetadata } from "@/hooks/url_metadata.hook";

type FormState = {
    file: File | null;
    collection: AttachmentCollection;
    modelId: string;
}

type Props = {
    _id: string;
}

export default function UploadAttachment({ _id }: Props) {
    const { id } = useURLMetadata();
    const attachmentCollection = useAttachmentCollection();

    const [formState, setFormState] = React.useState<FormState>({
        file: null,
        collection: attachmentCollection,
        modelId: _id,
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
            <label className="flex items-center justify-center space-x-1 p-1 border border-dashed border-gray-500 text-gray-600 rounded-md cursor-pointer">
                <PlusIcon />
                <span>Add Attachment</span>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
        </form>
    );
}