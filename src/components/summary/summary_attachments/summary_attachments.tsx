'use client'
import React from 'react';
import SummaryBase from "../summary_base";
import Attachment from './attachment';
import UploadAttachment from "./upload_attachment";

type Props = {
    files: {
        name: string;
        url: string;
    }[];
}

export default function SummaryAttachments({ files }: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        inputRef.current?.click();
    }

    return (
        <SummaryBase title="Attachments" action={handleUpload} label='Add Attachment'>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                {files.map((file, index) => (
                    <Attachment key={index} file={file} />
                ))}
            </div>
            <UploadAttachment inputRef={inputRef}/>
        </SummaryBase>
    )
}