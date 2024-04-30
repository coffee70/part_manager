'use client'
import { Filters } from '@/types/types';
import React from 'react';
import { DateRange } from 'react-day-picker';

type FilterContextType = Filters & {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    setStatusIds: React.Dispatch<React.SetStateAction<number[]>>;
    setShowArchived: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterContext = React.createContext<FilterContextType | null>(null);

export const useFilterContext = () => {
    const context = React.useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context;
}

type FilterProviderProps = {
    children: React.ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
    const [search, setSearch] = React.useState('');
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({ from: undefined, to: undefined });
    const [statusIds, setStatusIds] = React.useState<number[]>([]);
    const [showArchived, setShowArchived] = React.useState(false);

    return (
        <FilterContext.Provider 
        value={{
            search,
            dateRange,
            statusIds,
            showArchived,
            setSearch,
            setDateRange,
            setStatusIds,
            setShowArchived
        }}
        >
            {children}
        </FilterContext.Provider>
    )
}
