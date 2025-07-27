import NumberFieldFilterBase from "@/components/list/filters/filter_number_field/filter_number_field_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

type Props = {
    fieldId: string;
    placeholder?: string;
}

export default function NumberFieldFilter({ fieldId, placeholder }: Props) {
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
        <Filter trigger={<FilterButton active={isActive} />}>
            <NumberFieldFilterBase fieldId={fieldId} placeholder={placeholder} />
        </Filter>
    )
} 