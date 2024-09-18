import { PlusIcon } from "lucide-react";
import { AttachmentData, createAttachment } from "@/server/attachments/create_attachment";
import { useAttachmentModel } from "@/hooks/attachment_model.hook";

type Props = {
    id: number;
}

export default function UploadAttachment({ id }: Props) {
    const attachmentModel = useAttachmentModel();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const form = event.target.closest('form');
        if (form) {
            form.requestSubmit();
        }
    };

    return (
        <form action={createAttachment}>
            <label className="flex items-center justify-center space-x-1 p-1 border border-dashed border-gray-500 text-gray-600 rounded-md cursor-pointer">
                <PlusIcon />
                <span>Add Attachment</span>
                <input type="file" className="hidden" name="file" onChange={handleFileChange} />
                <input type="text" className="hidden" name="type" value={attachmentModel} readOnly />
                <input type="number" className="hidden" name="id" value={id} readOnly />
            </label>
        </form>
    );
}