import PriorityFilterBase from "@/components/list/filters/filter_priority/filter_priority_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

export default function PriorityFilter() {
    const searchParams = useSearchParams();
    const priorityFilter = searchParams.get('priority');
    const isActive = !!priorityFilter;

    return (
        <Filter trigger={
            <FilterButton 
                active={isActive} 
                data-testid='priority-filter-trigger' 
            />
        }>
            <PriorityFilterBase />
        </Filter>
    )
}