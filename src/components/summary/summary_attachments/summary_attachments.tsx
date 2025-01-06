'use client'
import React from 'react';
import SummaryBase from "../summary_base";
import Attachment from './attachment';
import UploadAttachment from "./upload_attachment";
import { useQuery } from '@tanstack/react-query';
import { attachmentKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getAttachments } from '@/server/attachments/get_attachments';

export default function SummaryAttachments() {
    const { modelId, instanceId } = useInstanceURL();

    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        inputRef.current?.click();
    }

    const { data: attachments } = useQuery({
        queryKey: attachmentKeys.all(modelId, instanceId),
        queryFn: () => getAttachments({ modelId, instanceId }),
    })

    return (
        <SummaryBase title="Attachments" action={handleUpload} label='Add Attachment'>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                {attachments?.map((file) => (
                    <Attachment key={file._id} file={file} />
                ))}
            </div>
            <UploadAttachment inputRef={inputRef} />
        </SummaryBase>
    )
}