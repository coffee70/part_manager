import { Part, Serial } from "@/types/collections";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import SerialForm from "@/app/(user)/serials/_forms/serial_form";

type Props = {
    serial: Serial;
}

export default function EditPart({ serial }: Props) {
    return (
        <SerialForm serial={serial}>
            <Button variant='secondary' className="py-4 px rounded-sm border text-base font-bold">
                <div className="flex items-center space-x-2">
                    <PencilIcon size={20} />
                    <span>Edit</span>
                </div>
            </Button>
        </SerialForm>
    )
}