import DateFieldFilterBase from "@/components/list/filters/filter_date_field/filter_date_field_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

type Props = {
    fieldId: string;
}

export default function DateFieldFilter({ fieldId }: Props) {
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
            <DateFieldFilterBase fieldId={fieldId} />
        </Filter>
    )
} 