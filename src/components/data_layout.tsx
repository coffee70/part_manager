import { useFilterContext } from "./filters/filter_context";
import FilterToolbar from "./filters/filter_toolbar";
import SearchInput from "./search_input";
import DateFilter from "./filters/filter_date";
import StatusFilter from "./filters/filter_status";
import DataTable from "./data_table/data_table";
import { fetchOrderData } from "../api/orderData";

export default function DataLayout() {
    const { showArchived } = useFilterContext()
    const { incomplete, complete } = fetchOrderData()
    return (
        <div className="flex flex-col space-y-4">
            <FilterToolbar toggle={{ label: "Show completed orders" }}>
                <SearchInput />
                <DateFilter />
                <StatusFilter />
            </FilterToolbar>
            <DataTable data={incomplete} />
            {showArchived && <DataTable data={complete} archived />}
        </div>
    )
}