'use client'
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

export default function NotEditing({ setIsEditing }: { setIsEditing: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Button
            variant='icon'
            className="grow bg-foreground p-1 rounded-none invisible group-hover:visible"
            onClick={() => setIsEditing(true)}
            type="button"
        >
            <PencilIcon />
        </Button>
    )
}