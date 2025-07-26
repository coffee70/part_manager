import LinksFilterBase from "@/components/list/filters/filter_links/filter_links_base";
import FilterButton from "@/components/list/filters/base_filters/filter_button";
import Filter from "@/components/list/filters/base_filters/filter";
import { useSearchParams } from "next/navigation";

export default function LinksFilter() {
    const searchParams = useSearchParams();
    const linksFilter = searchParams.get('link');
    const isActive = !!linksFilter;

    return (
        <Filter trigger={<FilterButton active={isActive} />}>
            <LinksFilterBase />
        </Filter>
    )
} 