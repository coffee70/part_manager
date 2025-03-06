'use client'
import React from 'react';
import SummaryBase from "../summary_base";
import Attachment from './attachment';
import UploadAttachment from "./upload_attachment";
import { useQuery } from '@tanstack/react-query';
import { attachmentKeys } from '@/lib/query_keys';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { getAttachments } from '@/server/attachments/get_attachments';
import { useMoreContext } from '../summary_actions/more/more_context';

export default function SummaryAttachments() {
    const { context, id, instanceId } = useInstanceURL();

    const {
        attachmentsInputRef: inputRef,
    } = useMoreContext();

    const handleUpload = () => {
        inputRef.current?.click();
    }

    const { data: attachments } = useQuery({
        queryKey: attachmentKeys.all(context, id, instanceId),
        queryFn: () => getAttachments({ context, id, instanceId }),
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