import { Part } from "@/types/collections";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import PartForm from "./part_form";

type Props = {
    part: Part;
}

export default function EditPart({ part }: Props) {
    return (
        <PartForm part={part}>
            <Button variant='secondary' className="py-4 px rounded-sm border text-base font-bold">
                <div className="flex items-center space-x-2">
                    <PencilIcon size={20} />
                    <span>Edit</span>
                </div>
            </Button>
        </PartForm>
    )
}