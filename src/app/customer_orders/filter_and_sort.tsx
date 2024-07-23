'use client'
import { FilterToolbar, FilterToolbarRow } from "@/components/filters/filter_toolbar"
import SearchInput from "@/components/filters/search_input"
import Filter from "@/components/filters/filter"
import Sort from "@/components/sorting/sort"
import { useSearchParams } from "next/navigation"
import { useRouterHelpers } from "@/lib/search_params"
import useSort from "@/hooks/sort.hook"
import useFilter from "@/hooks/filter.hook"

export default function FilterSort() {
    const searchParams = useSearchParams()
    const { pushSearchParams } = useRouterHelpers()

    // search input
    const search = searchParams.get('search') || ''
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        pushSearchParams({ search: e.target.value.length > 0 ? e.target.value : undefined })
    }

    // filters
    const { filters, setFilters } = useFilter({
        updatedAt:{
            value: { to: undefined, from: undefined },
        },
        statusId: {
            value: []
        }
    })

    // sort
    const { sort, setSort } = useSort({
        number: {
            label: 'Number',
        },
        updatedAt: {
            label: 'Updated At',
        }
    })
    
    return (
        <FilterToolbar>
        <FilterToolbarRow>
            <SearchInput value={search} onChange={handleSearchChange}/>
            <Filter filters={filters} setFilters={setFilters} />
            <Sort sort={sort} setSort={setSort} />
        </FilterToolbarRow>
        {/* <FilterToolbarRow>
            <Toggle label="Show Completed" value={showCompleted} onChange={setShowCompleted} />
        </FilterToolbarRow> */}
    </FilterToolbar>
    )
}