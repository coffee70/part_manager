import React from "react";
import { DataAction } from "@/components/ui/data_action";
import { PlusIcon } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const New = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    return (
        <DataAction
            ref={ref}
            label='New'
            {...props}
        >
            <PlusIcon width={24} height={24} />
        </DataAction>
    );
});

New.displayName = 'New';

export default New;