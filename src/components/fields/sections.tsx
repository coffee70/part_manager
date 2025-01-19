'use client'
import React from 'react';
import AddSection from './section/add_section';
import Section from './section';
import { AppBar } from '@/components/ui/app_bar';
import { useQuery } from "@tanstack/react-query";
import { getSections } from "@/server/sections/get_sections";
import { useFieldURL } from '@/hooks/url_metadata.hook';
import { modelKeys, sectionKeys } from '@/lib/query_keys';
import { PageTitle } from '@/components/ui/page_title';
import { FieldIcon } from '@/components/ui/icons/icons';
import { getModel } from '@/server/models/get_model';
import ModelSelect from './model_select';
import { SectionProvider } from './section.context';

const Loading = () => <div>Loading...</div>;
const Error = () => <div>Error...</div>;

export default function Sections() {
    const { modelId } = useFieldURL();

    const { data, isError, isPending } = useQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    });

    const { data: model } = useQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    if (isPending) return <Loading />;
    if (isError) return <Error />;

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    title="Fields"
                    subtitle={model?.name}
                    icon={<FieldIcon size={50} />}
                />
                <div className='flex items-center space-x-4'>
                    <ModelSelect />
                    <AddSection />
                </div>
            </AppBar>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {data.map(section => (
                    <SectionProvider key={section._id} section={section}>
                        <Section />
                    </SectionProvider>
                ))}
            </div>
        </div>
    );
}