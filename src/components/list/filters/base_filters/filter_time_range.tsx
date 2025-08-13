'use client'
import * as React from "react"
import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";

type Props = {
    paramKey?: string;
    fieldId?: string;
}

type TimeRange = {
    start?: string;
    end?: string;
}

export default function TimeRangeFilter({ paramKey, fieldId }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Determine if we're using custom field filtering or regular param filtering
    const isCustomField = !!fieldId;

    // Get initial time range based on filtering type
    const getInitialTimeRange = (): TimeRange => {
        let param;
        
        if (isCustomField) {
            const customFieldParam = searchParams.get('custom-field');
            if (!customFieldParam) return {};
            
            try {
                const customFields = JSON.parse(customFieldParam);
                param = customFields[fieldId!];
            } catch {
                return {};
            }
        } else {
            param = searchParams.get(paramKey!);
        }

        if (!param) return {};
        
        try {
            return JSON.parse(param);
        } catch {
            return {};
        }
    };

    const initialTimeRange = getInitialTimeRange();
    const [startTime, setStartTime] = React.useState(initialTimeRange.start || '');
    const [endTime, setEndTime] = React.useState(initialTimeRange.end || '');

    const startRef = React.useRef<HTMLInputElement>(null);
    const endRef = React.useRef<HTMLInputElement>(null);

    const updateTimeRange = useDebouncedCallback((start: string, end: string) => {
        const params = new URLSearchParams(searchParams);
        const timeRange: TimeRange = {};
        
        if (start.length > 0) timeRange.start = start;
        if (end.length > 0) timeRange.end = end;
        
        if (isCustomField) {
            const customFieldParam = params.get('custom-field');
            
            let customFields: Record<string, string> = {};
            if (customFieldParam) {
                try {
                    customFields = JSON.parse(customFieldParam);
                } catch {
                    customFields = {};
                }
            }
            
            if (Object.keys(timeRange).length > 0) {
                customFields[fieldId!] = JSON.stringify(timeRange);
                params.set('custom-field', JSON.stringify(customFields));
            } else {
                delete customFields[fieldId!];
                if (Object.keys(customFields).length === 0) {
                    params.delete('custom-field');
                } else {
                    params.set('custom-field', JSON.stringify(customFields));
                }
            }
        } else {
            if (Object.keys(timeRange).length > 0) {
                params.set(paramKey!, JSON.stringify(timeRange));
            } else {
                params.delete(paramKey!);
            }
        }
        
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
        const newUrl = `${pathname}?${params.toString()}`;
        push(newUrl);
    }, 300);

    const onStartTimeChange = (time: string) => {
        setStartTime(time);
        updateTimeRange(time, endTime);
    }

    const onEndTimeChange = (time: string) => {
        setEndTime(time);
        updateTimeRange(startTime, time);
    }

    const clearStartTime = () => {
        setStartTime('');
        updateTimeRange('', endTime);
        if (startRef.current) {
            startRef.current.focus();
        }
    }

    const clearEndTime = () => {
        setEndTime('');
        updateTimeRange(startTime, '');
        if (endRef.current) {
            endRef.current.focus();
        }
    }

    return (
        <div className="flex flex-col space-y-3 p-3">
            {/* Start Time Input */}
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-stone-700 w-12">From:</label>
                <div className="flex items-center flex-grow space-x-2 px-3 h-10 bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors duration-200 focus-within:ring-1 focus-within:ring-stone-400 focus-within:border-stone-400">
                    <Input
                        ref={startRef}
                        type='time'
                        className="bg-transparent border-none shadow-none text-stone-700 font-medium focus-visible:ring-0 p-0 h-auto"
                        onChange={e => onStartTimeChange(e.target.value)}
                        value={startTime}
                    />
                    <button
                        onClick={clearStartTime}
                        disabled={startTime.length === 0}
                        className={`p-1 rounded transition-colors ${
                            startTime.length > 0
                                ? "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                : "text-stone-300 cursor-not-allowed"
                        }`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* End Time Input */}
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-stone-700 w-12">To:</label>
                <div className="flex items-center flex-grow space-x-2 px-3 h-10 bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors duration-200 focus-within:ring-1 focus-within:ring-stone-400 focus-within:border-stone-400">
                    <Input
                        ref={endRef}
                        type='time'
                        className="bg-transparent border-none shadow-none text-stone-700 font-medium focus-visible:ring-0 p-0 h-auto"
                        onChange={e => onEndTimeChange(e.target.value)}
                        value={endTime}
                    />
                    <button
                        onClick={clearEndTime}
                        disabled={endTime.length === 0}
                        className={`p-1 rounded transition-colors ${
                            endTime.length > 0
                                ? "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                : "text-stone-300 cursor-not-allowed"
                        }`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
} 