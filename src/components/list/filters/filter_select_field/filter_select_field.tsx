import SelectFieldFilterBase from "@/components/list/filters/filter_select_field/filter_select_field_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

type Props = {
    fieldId: string;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
}

export default function SelectFieldFilter({ fieldId, options, multiple, creative }: Props) {
    const searchParams = useSearchParams();
    
    // Check if this specific field has an active filter
    const getIsActive = () => {
        const customFieldParam = searchParams.get('custom-field');
        if (!customFieldParam) return false;
        
        try {
            const customFields = JSON.parse(customFieldParam);
            const value = customFields[fieldId];
            if (!value) return false;
            
            // Parse the stored value and check if it's not empty
            const parsedValue = JSON.parse(value);
            if (Array.isArray(parsedValue)) {
                return parsedValue.length > 0;
            }
            return parsedValue !== undefined && parsedValue !== '';
        } catch {
            return false;
        }
    };
    
    const isActive = getIsActive();

    return (
        <Filter trigger={<FilterButton active={isActive} />}>
            <SelectFieldFilterBase 
                fieldId={fieldId} 
                options={options}
                multiple={multiple}
                creative={creative}
            />
        </Filter>
    )
} 