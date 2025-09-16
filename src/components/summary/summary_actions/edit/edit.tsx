import React from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Edit = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    return (
        <Button
            ref={ref}
            variant='secondary'
            className="py-4 px rounded-sm border border-secondary-border text-base font-bold"
            {...props}
        >
            <div className="flex items-center space-x-2">
                <PencilIcon size={20} />
                <span>Edit</span>
            </div>
        </Button>
    );
});

Edit.displayName = 'Edit';

export default Edit;