import { NotFoundIcon } from "@/components/ui/icons/icons";

export default function RouterError() {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    <NotFoundIcon size={50} />
                    <p className="text-center text-xl font-bold">No Routers Found</p>
                    <p className="text-center">Select or create a router to view more information about it.</p>
                </div>
            </div>
        </div>
    )
} 