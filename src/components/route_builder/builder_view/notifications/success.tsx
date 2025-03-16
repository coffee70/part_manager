import { CheckIcon } from "lucide-react";
import { useBuilderContext } from "../builder.context";
import { cn } from "@/lib/utils";
import React from "react";

const Success = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(function Success(props, ref) {
    const { notification, isNotifying } = useBuilderContext();
    return (
        <div
            {...props}
            ref={ref}
            className={cn(
                "absolute flex items-center justify-center space-x-2 bg-green-50 border border-green-600 text-green-600 text-xs font-semibold rounded-md p-1 shadow-md transform transition-[transform,opacity] duration-300 ease-in-out",
                isNotifying && notification?.type === "success" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
                props.className
            )}
        >
            <CheckIcon size={20} />
            <span>{notification?.message}</span>
        </div>
    );
});

export default Success;