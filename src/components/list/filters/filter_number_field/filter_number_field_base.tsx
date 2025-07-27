'use client'
import TextFilter from "@/components/list/filters/base_filters/filter_text";

type Props = {
    fieldId: string;
    placeholder?: string;
}

export default function NumberFieldFilterBase({ fieldId, placeholder = "Filter by number..." }: Props) {
    return (
        <TextFilter 
            fieldId={fieldId}
            inputType="number" 
            placeholder={placeholder} 
        />
    )
} 