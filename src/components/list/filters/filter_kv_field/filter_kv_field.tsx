import KVFieldFilterBase from "@/components/list/filters/filter_kv_field/filter_kv_field_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

type Props = {
    fieldId: string;
    keys: string[];
    fieldName: string;
}

export default function KVFieldFilter({ fieldId, keys, fieldName }: Props) {
    const searchParams = useSearchParams();
    
    // Check if this specific field has an active filter
    const getIsActive = () => {
        const customFieldParam = searchParams.get('custom-field');
        if (!customFieldParam) return false;
        
        try {
            const customFields = JSON.parse(customFieldParam);
            return !!customFields[fieldId];
        } catch {
            return false;
        }
    };
    
    const isActive = getIsActive();

    return (
        <Filter trigger={
            <FilterButton 
                active={isActive} 
                data-testid={`kv-field-filter-trigger-${fieldName}`} 
            />
        }>
            <KVFieldFilterBase fieldId={fieldId} keys={keys} />
        </Filter>
    )
}