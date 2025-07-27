'use client'
import TimeRangeFilter from "@/components/list/filters/base_filters/filter_time_range";

type Props = {
    fieldId: string;
}

export default function TimeFieldFilterBase({ fieldId }: Props) {
    return (
        <TimeRangeFilter fieldId={fieldId} />
    )
} 