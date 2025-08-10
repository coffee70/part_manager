import React from "react";
import { DataAction } from "@/components/ui/data_action";
import { Columns3CogIcon } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const TableConfiguration = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    return (
        <DataAction
            ref={ref}
            label='Table Configuration'
            data-testid='table-configuration-trigger'
            {...props}
        >
            <Columns3CogIcon width={24} height={24} />
        </DataAction>
    );
});

TableConfiguration.displayName = 'TableConfiguration';

export default TableConfiguration; 