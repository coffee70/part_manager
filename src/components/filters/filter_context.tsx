'use client'
import { Status } from '@/types/types';
import React from 'react';

type FilterContextType = {
    search: string;
    dateRange: {
        start: string;
        end: string;
    };
    statuses: Status[];
    showArchived: boolean;

    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string; }>>;
    setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
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
    const [dateRange, setDateRange] = React.useState({ start: '', end: '' });
    const [statuses, setStatuses] = React.useState<Status[]>([]);
    const [showArchived, setShowArchived] = React.useState(false);

    return (
        <FilterContext.Provider 
        value={{
            search,
            dateRange,
            statuses,
            showArchived,
            setSearch,
            setDateRange,
            setStatuses,
            setShowArchived
        }}
        >
            {children}
        </FilterContext.Provider>
    )
}
