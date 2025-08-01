'use client'
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from 'react-day-picker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { useQueryClient } from '@tanstack/react-query';
import { instanceKeys } from '@/lib/query_keys';

type Props = {
    paramKey?: string;
    fieldId?: string;
}

export default function DateRangeFilter({ paramKey, fieldId }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Determine if we're using custom field filtering or regular param filtering
    const isCustomField = !!fieldId;

    // Get initial date range based on filtering type
    const getInitialDateRange = () => {
        let param;
        
        if (isCustomField) {
            const customFieldParam = searchParams.get('custom-field');
            if (!customFieldParam) return undefined;
            
            try {
                const customFields = JSON.parse(customFieldParam);
                param = customFields[fieldId!];
            } catch {
                return undefined;
            }
        } else {
            param = searchParams.get(paramKey!);
        }

        if (!param) return undefined;
        
        try {
            const initParam = JSON.parse(param);
            return {
                from: initParam?.from ? new Date(initParam.from) : undefined,
                to: initParam?.to ? new Date(initParam.to) : undefined,
            };
        } catch {
            return undefined;
        }
    };

    const initDate = getInitialDateRange();
    
    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    const onChange = (value: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams);
        
        if (isCustomField) {
            const customFieldParam = params.get('custom-field');
            
            let customFields: Record<string, string> = {};
            if (customFieldParam) {
                try {
                    customFields = JSON.parse(customFieldParam);
                } catch {
                    customFields = {};
                }
            }
            
            if (value) {
                customFields[fieldId!] = JSON.stringify(value);
                params.set('custom-field', JSON.stringify(customFields));
            } else {
                delete customFields[fieldId!];
                if (Object.keys(customFields).length === 0) {
                    params.delete('custom-field');
                } else {
                    params.set('custom-field', JSON.stringify(customFields));
                }
            }
        } else {
            if (value) {
                params.set(paramKey!, JSON.stringify(value));
            } else {
                params.delete(paramKey!);
            }
        }
        
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
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