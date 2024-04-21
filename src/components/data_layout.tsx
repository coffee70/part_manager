import { useFilterContext } from "./filters/filter_context";
import FilterToolbar from "./filters/filter_toolbar";
import SearchInput from "./search_input";
import DataTable from "./data_table/data_table";
import { fetchOrderData } from "../api/orderData";
import Filter from "./filters/filter";

export default function DataLayout() {
    const {
        search,
        dateRange,
        statusIds,
        showArchived,
        setSearch,
    } = useFilterContext()
    const { incomplete, complete } = fetchOrderData({ search, dateRange, statusIds, showArchived })
    return (
        <div className="flex flex-col space-y-4">
            <FilterToolbar toggle={{ label: "Show completed orders" }}>
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Filter />
            </FilterToolbar>
            <DataTable data={incomplete} />
            {showArchived && <DataTable data={complete} archived />}
        </div>
    )
}