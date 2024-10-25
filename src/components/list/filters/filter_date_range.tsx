'use client'
import { Calendar } from "../../ui/calendar";
import { type DateRange } from 'react-day-picker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { useQueryClient } from '@tanstack/react-query';
import { collectionKeys } from '@/lib/query_keys';

type Props = {
    paramKey: string;
}

export default function DateRangeFilter({ paramKey }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const param = searchParams.get(paramKey);
    const initParam = param ? JSON.parse(param) : undefined;
    const initDate = {
        from: initParam?.from ? new Date(initParam.from) : undefined,
        to: initParam?.to ? new Date(initParam.to) : undefined,
    }
    
    const { collection } = useURLMetadata();
    const queryClient = useQueryClient();

    const onChange = (value: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(paramKey, JSON.stringify(value));
        } else {
            params.delete(paramKey);
        }
        queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) });
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Calendar
            mode="range"
            selected={initDate}
            onSelect={onChange}
        />
    )
}