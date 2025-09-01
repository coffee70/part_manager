import { CheckCircleIcon } from "lucide-react";

export default function RouteCompleted() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <CheckCircleIcon size={50} className="text-green-500" />
            <p className="text-center text-xl font-bold">Route Completed</p>
            <p className="text-center">Click on a step to view more information about it.</p>
        </div>
    )
}
