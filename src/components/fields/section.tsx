'use client'
import React from 'react';
import DeleteSection from '@/components/fields/section/delete_section';
import SectionTitle from '@/components/fields/section_title';
import Fields from './fields';
import type { Section } from '@/types/collections';
import NewField from './field/new_field';

export default function Section() {
    return (
        <>
            <div className="flex items-center justify-between">
                <SectionTitle />
                <div className='flex space-x-3'>
                    <NewField />
                    <DeleteSection />
                </div>
            </div>
            <Fields />
        </>
    )
}

