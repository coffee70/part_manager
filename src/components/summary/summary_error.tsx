import { ArrowLeftIcon } from "lucide-react";

export default function SummaryError() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <div className="p-2 bg-black text-white rounded-md">
            <ArrowLeftIcon size={36} />
            </div>
            <p className="text-center">Select or create an item to view more information about it.</p>
        </div>
    )
}