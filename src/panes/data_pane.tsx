'use client'
import React from 'react';
import { FilterProvider } from '../context/filters/filter.context';
import DataLayout from '../components/data_layout';


export default function DataPane() {
    return (
        <FilterProvider>
            <DataLayout />
        </FilterProvider>
    )
}