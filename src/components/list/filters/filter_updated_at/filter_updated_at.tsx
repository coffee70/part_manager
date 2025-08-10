import UpdatedAtFilterBase from "@/components/list/filters/filter_updated_at/filter_updated_at_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

export default function UpdatedAtFilter() {
    const searchParams = useSearchParams();
    const updatedAtFilter = searchParams.get('updatedAt');
    const isActive = !!updatedAtFilter;

    return (
        <Filter trigger={
            <FilterButton 
                active={isActive} 
                data-testid='updated-at-filter-trigger' 
            />
        }>
            <UpdatedAtFilterBase />
        </Filter>
    )
} 