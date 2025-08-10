import NumberFilterBase from "@/components/list/filters/filter_number/filter_number_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

export default function NumberFilter() {
    const searchParams = useSearchParams();
    const numberFilter = searchParams.get('number');
    const isActive = !!numberFilter;

    return (
        <Filter trigger={
            <FilterButton 
                active={isActive} 
                data-testid='number-filter-trigger' 
            />
        }>
            <NumberFilterBase />
        </Filter>
    )
} 