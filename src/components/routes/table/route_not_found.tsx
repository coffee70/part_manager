import { AlertCircleIcon } from "lucide-react";

export default function RouteNotFound() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <AlertCircleIcon size={50} className="text-red-500" />
            <p className="text-center text-xl font-bold">Route Not Found</p>
            <p className="text-center">Select or create a route on the instance to view more information about it.</p>
        </div>
    )
}
