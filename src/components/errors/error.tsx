import { XCircleIcon } from "lucide-react";

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <XCircleIcon size={50} className="text-red-500" />
            <p className="text-center text-xl font-bold">Something Went Wrong</p>
            <p className="text-center">An error occurred. Please try again or contact support if the issue persists.</p>
        </div>
    )
}
