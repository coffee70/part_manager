'use client'
import TextFilter from "@/components/list/filters/base_filters/filter_text";

export default function NumberFilterBase() {
    return (
        <TextFilter 
            paramKey="number"
            inputType="text" 
            placeholder="Filter by instance number..." 
        />
    )
} 