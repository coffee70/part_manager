'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useAdminURL } from '@/hooks/url_metadata.hook';
import { contextKeys } from '@/lib/query_keys';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { router } from '@/lib/url';
import { useRouter } from 'next/navigation';
import { getContext } from '@/server/contexts/get_context';
import { getContexts } from '@/server/contexts/get_contexts';

export default function ModelSelect() {
    const { context, id } = useAdminURL();

    const { data: contextImpl } = useQuery({
        queryKey: contextKeys.id(context, id),
        queryFn: () => getContext({
            context,
            id
        }),
    })

    const { data: contexts } = useQuery({
        queryKey: contextKeys.all(context),
        queryFn: () => getContexts({ context }),
    })

    const nextRouter = useRouter();

    const handleNavigate = (id: string) => {
        const url = router().context(context).admin().fields().context(id);
        nextRouter.push(url);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button id='model-select' variant='secondary' className='justify-between space-x-2 min-w-44'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full' style={{ backgroundColor: contextImpl?.color }} />
                        <span>{contextImpl?.name}</span>
                    </div>
                    <ChevronDownIcon size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-44'>
                <DropdownMenuGroup>
                    {contexts?.map(contextImpl => (
                        <DropdownMenuItem
                            key={contextImpl._id}
                            className='flex items-center space-x-2'
                            onClick={() => handleNavigate(contextImpl._id)}
                        >
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: contextImpl.color }} />
                            <span>{contextImpl.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}