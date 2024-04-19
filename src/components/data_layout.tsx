import { useFilterContext } from "./filters/filter_context";
import FilterToolbar from "./filters/filter_toolbar";
import SearchInput from "./search_input";
import DateFilter from "./filters/filter_date";
import StatusFilter from "./filters/filter_status";
import DataTable from "./data_table/data_table";
import { fetchOrderData } from "../api/orderData";

export default function DataLayout() {
    const {
        search,
        dateRange,
        statusIds,
        showArchived,
        setSearch,
        setStatusIds
    } = useFilterContext()
    const { incomplete, complete } = fetchOrderData({ search, dateRange, statusIds, showArchived })
    return (
        <div className="flex flex-col space-y-4">
            <FilterToolbar toggle={{ label: "Show completed orders" }}>
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <DateFilter />
                <StatusFilter
                    value={statusIds}
                    onChange={(ids) => setStatusIds(ids)}
                />
            </FilterToolbar>
            <DataTable data={incomplete} />
            {showArchived && <DataTable data={complete} archived />}
        </div>
    )
}