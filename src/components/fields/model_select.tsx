'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useAdminURL } from '@/hooks/url_metadata.hook';
import { modelKeys } from '@/lib/query_keys';
import { getModel } from '@/server/models/get_model';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { getModels } from '@/server/models/get_models';
import { Button } from '../ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ModelSelect() {
    const { modelId } = useAdminURL();

    const { data: model } = useQuery({
        queryKey: modelKeys.id(modelId),
        queryFn: () => getModel({ modelId }),
    })

    const { data: models } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button id='model-select' variant='secondary' className='justify-between space-x-2 min-w-44'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full' style={{ backgroundColor: model?.color }} />
                        <span>{model?.name}</span>
                    </div>
                    <ChevronDownIcon size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-44'>
                <DropdownMenuGroup>
                    {models?.map(model => (
                        <DropdownMenuItem
                            key={model._id}
                            className='flex items-center space-x-2'
                            onClick={() => router.push(`/fields?modelId=${model._id}`)}
                        >
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: model.color }} />
                            <span>{model.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}