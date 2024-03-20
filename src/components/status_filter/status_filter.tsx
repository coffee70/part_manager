import StatusIcon from "../svg/status_icon"
import Filter from "@/components/ui/filter/filter";
import FilterTrigger from "@/components/ui/filter/filter_trigger";
import FilterContent from "@/components/ui/filter/filter_content";
import StatusFilterItem from "@/components/status_filter/status_filter_item";


type Props = {
    statuses: {
        label: string;
        color: string;
    }[];
}

export default function StatusFilter({ statuses }: Props) {
    return (
        <Filter>
        <FilterTrigger>
            <StatusIcon  width={24} height={24}/>
        </FilterTrigger>
        <FilterContent>
            {statuses.map((status) => (
                <StatusFilterItem key={status.label} label={status.label} color={status.color} />
            ))}
        </FilterContent>
    </Filter>
    )
}

