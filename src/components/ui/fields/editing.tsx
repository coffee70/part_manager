import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function Editing() {
    return (
        <Button
            variant='icon'
            className="grow bg-foreground p-1 rounded-none"
            type="submit"
        >
            <CheckIcon />
        </Button>
    )
}