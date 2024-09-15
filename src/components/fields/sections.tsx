'use client'
import React from 'react';
import Title from '@/components/fields/components/title';
import AddSection from './add_section/add_section';
import Section from './components/section';
import { AppBar } from '../ui/app_bar';
import { useQuery } from "@tanstack/react-query";
import { getSections } from "@/server/sections/get_sections";
import { useSectionModel } from '@/hooks/section_model.hook';

const Loading = () => <div>Loading...</div>;
const Error = () => <div>Error...</div>;

export default function Sections() {
    const sectionModel = useSectionModel();

    const { data, isError, isPending } = useQuery({
        queryKey: ['sections', sectionModel],
        queryFn: () => getSections(sectionModel),
    });

    if (isPending) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <Title />
                <AddSection />
            </AppBar>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {data.map(section => (
                    <Section key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}

