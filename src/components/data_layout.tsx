import { useFilterContext } from "../context/filters/filter.context";
import FilterToolbar from "./filters/filter_toolbar";
import SearchInput from "./filters/search_input";
import DataTable from "./data_table/data_table";
import { fetchOrders } from "../api/data";
import Filter from "./filters/filter";
import Sort from "./sorting/sort";

export default function DataLayout() {
    const {
        search,
        dateRange,
        statusIds,
        showArchived,
        setSearch,
    } = useFilterContext()
    const { incomplete, complete } = fetchOrders({ search, dateRange, statusIds, showArchived })
    return (
        <div className="flex flex-col space-y-4">
            <FilterToolbar toggle={{ label: "Show completed orders" }}>
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Filter />
                <Sort />
            </FilterToolbar>
            <DataTable data={incomplete} />
            {showArchived && <DataTable data={complete} archived />}
        </div>
    )
}