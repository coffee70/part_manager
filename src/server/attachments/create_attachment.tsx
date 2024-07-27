'use server'
import prisma from "@/lib/database/prisma";
import { z } from "zod";

const ParamsSchema = z.object({
    file: z.custom<File>(),
    type: z.enum(['part', 'serial', 'customerOrder', 'shopOrder']),
    id: z.coerce.number(),
})

export type AttachmentData = z.infer<typeof ParamsSchema>;

export async function createAttachment(formData: FormData): Promise<string> {

    const { data, success, error } = ParamsSchema.safeParse({
        file: formData.get('file'),
        type: formData.get('type'),
        id: formData.get('id'),
    });

    if (!success) {
        throw new Error(`Invalid parameters: ${error}`);
    }

    const attachment = await prisma.attachment.create({
        data: {
            filename: data.file.name,
            serialId: data.type === 'serial' ? data.id : undefined,
            partId: data.type === 'part' ? data.id : undefined,
            customerOrderId: data.type === 'customerOrder' ? data.id : undefined,
            shopOrderId: data.type === 'shopOrder' ? data.id : undefined,
        }
    });

    // rename the file to the attachment uuid for storage
    const uuid = attachment.id;
    const uploadData = new FormData();
    uploadData.append('file', data.file, uuid);


    const response = await fetch(process.env.FILE_POST_URL as string, {
        method: 'POST',
        body: uploadData,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.filename) {
        return json.filename;
    } else {
        throw new Error("Failed to upload file: No filename returned");
    }
}