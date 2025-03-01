import { SearchXIcon } from "lucide-react";

export default function ModelError() {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    <div className="p-2 bg-black text-white rounded-md">
                        <SearchXIcon size={36} />
                    </div>
                    <p className="text-center text-xl font-bold">No Models Found</p>
                    <p className="text-center">Create a model first. Then create and view instances.</p>
                </div>
            </div>
        </div>
    )
}