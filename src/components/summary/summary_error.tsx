import { NotFoundIcon } from "@/components/ui/icons/icons";

export default function SummaryError() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <NotFoundIcon size={50} />
            <p className="text-center text-xl font-bold">No Instances Found</p>
            <p className="text-center">Select or create an instance to view more information about it.</p>
        </div>
    )
}