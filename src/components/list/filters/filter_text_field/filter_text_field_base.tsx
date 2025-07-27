'use client'
import TextFilter from "@/components/list/filters/base_filters/filter_text";

type Props = {
    fieldId: string;
    placeholder?: string;
}

export default function TextFieldFilterBase({ fieldId, placeholder = "Filter..." }: Props) {
    return (
        <TextFilter 
            fieldId={fieldId}
            inputType="text" 
            placeholder={placeholder} 
        />
    )
} 