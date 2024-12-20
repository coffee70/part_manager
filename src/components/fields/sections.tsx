'use client'
import React from 'react';
import AddSection from './section/add_section';
import Section from './section';
import { AppBar } from '@/components/ui/app_bar';
import { useQuery } from "@tanstack/react-query";
import { getSections } from "@/server/sections/get_sections";
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { sectionKeys } from '@/lib/query_keys';
import { PageTitle } from '@/components/ui/page_title';
import { FieldIcon } from '@/components/ui/icons/icons';

const Loading = () => <div>Loading...</div>;
const Error = () => <div>Error...</div>;

export default function Sections() {
    const { collection, name } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: sectionKeys.all(collection),
        queryFn: () => getSections({ collection: collection }),
    });

    if (isPending) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Fields"
                    subtitle={name}
                    icon={<FieldIcon size={50} />}
                />
                <AddSection />
            </AppBar>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {data.map(section => (
                    <Section key={section._id} section={section} />
                ))}
            </div>
        </div>
    );
}

