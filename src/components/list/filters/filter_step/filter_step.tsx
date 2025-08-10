import StepFilterBase from "@/components/list/filters/filter_step/filter_step_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

export default function StepFilter() {
    const searchParams = useSearchParams();
    const stepFilter = searchParams.getAll('step');
    const routeStatusFilter = searchParams.getAll('route-status');
    const isActive = stepFilter.length > 0 || routeStatusFilter.length > 0;

    return (
        <Filter trigger={
            <FilterButton 
                active={isActive} 
                data-testid='step-filter-trigger' 
            />
        }>
            <StepFilterBase />
        </Filter>
    )
} 