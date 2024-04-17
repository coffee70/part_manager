'use client'
import React from 'react';
import { FilterProvider } from '../filters/filter_context';
import DataLayout from '../data_layout';


export default function DataPane() {
    return (
        <FilterProvider>
            <DataLayout />
        </FilterProvider>
    )
}