import SummaryBase from "../summary_base";
import Attachment from './attachment';
import UploadAttachment from "./upload_attachment";

type Props = {
    files: {
        name: string;
        url: string;
    }[];
    uploads: {
        _id: string;
    }
}

export default function SummaryAttachments({ files, uploads }: Props) {
    return (
        <SummaryBase title="Attachments">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                {files.map((file, index) => (
                    <Attachment key={index} file={file} />
                ))}
            </div>
            <UploadAttachment {...uploads} />
        </SummaryBase>
    )
}