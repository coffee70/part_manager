import { AlertCircleIcon } from "lucide-react";

export default function RouteNotStarted() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <AlertCircleIcon size={50} className="text-amber-500" />
            <p className="text-center text-xl font-bold">Route Not Started</p>
            <p className="text-center">Click on one of the steps to view more information about it.</p>
        </div>
    )
}
