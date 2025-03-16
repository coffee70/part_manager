import { CircleAlertIcon } from "lucide-react";
import { useBuilderContext } from "../builder.context";
import { cn } from "@/lib/utils";
import React from "react";

const Error = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(function Error(props, ref) {
    const { notification, isNotifying } = useBuilderContext();
    return (
        <div
            {...props}
            ref={ref}
            className={cn(
                "absolute flex items-center justify-center space-x-2 bg-red-50 border border-red-600 text-red-600 text-xs font-semibold rounded-md p-1 shadow-md transform transition-[transform,opacity] duration-300 ease-in-out",
                isNotifying && notification?.type === "error" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
                props.className
            )}
            
        >
            <CircleAlertIcon size={20} />
            <span>{notification?.message}</span>
        </div>
    );
});

export default Error;