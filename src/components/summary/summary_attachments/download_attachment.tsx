'use client'
import { DownloadIcon } from 'lucide-react';

type DownloadAttachmentProps = {
    file: {
        name: string;
        base64: string;
        type: string;
    };
}
export default function DownloadAttachment({ file }: DownloadAttachmentProps) {
    const handleClick = async () => {
        const blob = await fetch(`data:${file.type};base64,${file.base64}`).then(res => res.blob());
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <button
            className='flex items-center justify-center bg-foreground disabled:hover:bg-foreground disabled:text-accent-foreground hover:bg-accent-foreground w-8 h-8 rounded-full'
            onClick={handleClick}
        >
            <DownloadIcon size={20} />
        </button>
    )
}