import { SearchXIcon } from "lucide-react";

export default function SummaryError() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <div className="p-2 bg-black text-white rounded-md">
                <SearchXIcon size={36} />
            </div>
            <p className="text-center text-xl font-bold">No Instances Found</p>
            <p className="text-center">Select or create an instance to view more information about it.</p>
        </div>
    )
}