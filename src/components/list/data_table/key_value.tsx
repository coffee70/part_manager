import { KVValue } from "@/types/collections";

export default function KeyValue({ kvValue }: { kvValue: KVValue | undefined }) {
    if (!kvValue || Object.keys(kvValue).length === 0) {
        return <></>
    }

    return (
        <div className="space-y-1 max-w-xs max-h-24 overflow-y-auto scrollbar-thin">
            {Object.entries(kvValue).map(([key, value]) => (
                <div 
                    key={key} 
                    className="flex items-center gap-2 rounded text-xs"
                >
                    <div className="flex items-center justify-center">
                        <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">
                            {key}
                        </span>
                        <span className="text-gray-500">:</span>
                    </div>
                    <span className="text-gray-800 min-w-0 truncate">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    )
}