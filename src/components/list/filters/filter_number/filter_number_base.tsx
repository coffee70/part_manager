'use client'
import TextFilter from "@/components/list/filters/base_filters/filter_text";

export default function NumberFilterBase() {
    return (
        <TextFilter 
            paramKey="number" 
            placeholder="Filter by number..." 
        />
    )
} 