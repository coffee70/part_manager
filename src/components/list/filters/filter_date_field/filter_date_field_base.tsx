'use client'
import DateRangeFilter from "@/components/list/filters/base_filters/filter_date_range";

type Props = {
    fieldId: string;
}

export default function DateFieldFilterBase({ fieldId }: Props) {
    return (
        <DateRangeFilter fieldId={fieldId} />
    )
} 