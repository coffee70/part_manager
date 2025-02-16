import { CheckIcon } from "lucide-react";
import { useBuilderContext } from "../builder.context";
import { cn } from "@/lib/utils";

export default function Success() {
    const { saveSuccess } = useBuilderContext();
    return (
        <div
            className={cn(
                "flex items-center justify-center space-x-2 bg-green-50 border border-green-600 text-green-600 text-xs font-semibold rounded-md p-1 shadow-md transform transition-all duration-300 ease-in-out",
                saveSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
        >
            <CheckIcon size={20} />
            <span>Route has been saved successfully!</span>
        </div>
    )
}