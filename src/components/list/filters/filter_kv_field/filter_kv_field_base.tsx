'use client'
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";
import { KVValue } from "@/types/collections";
import KVFieldComponent from "./kv_field_component";

type Props = {
    fieldId: string;
    keys: string[];
}

export default function KVFieldFilterBase({ fieldId, keys }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { context, id } = useInstanceURL();
    const queryClient = useQueryClient();

    // Parse current URL parameter for this specific field
    const getCurrentValue = (): KVValue => {
        const customFieldParam = searchParams.get('custom-field');
        if (!customFieldParam) return {};
        
        try {
            const customFields = JSON.parse(customFieldParam);
            const fieldValue = customFields[fieldId];
            return fieldValue ? JSON.parse(fieldValue) : {};
        } catch {
            return {};
        }
    };

    const currentValue = getCurrentValue();

    // Handle value changes
    const handleValueChange = React.useCallback((value: KVValue) => {
        const params = new URLSearchParams(searchParams);
        const originalParamsString = params.toString();
        
        // Get current custom field filters
        const customFieldParam = params.get('custom-field');
        let customFields: Record<string, string> = {};
        
        if (customFieldParam) {
            try {
                customFields = JSON.parse(customFieldParam);
            } catch {
                customFields = {};
            }
        }
        
        // Check if value has any non-empty entries
        const hasValues = Object.values(value).some(v => v && v.trim() !== '');
        
        if (hasValues) {
            customFields[fieldId] = JSON.stringify(value);
        } else {
            delete customFields[fieldId];
        }
        
        // Update or remove the custom-field parameter
        if (Object.keys(customFields).length > 0) {
            params.set('custom-field', JSON.stringify(customFields));
        } else {
            params.delete('custom-field');
        }
        
        // Only update URL and invalidate queries if parameters actually changed
        const newParamsString = params.toString();
        if (originalParamsString !== newParamsString) {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            replace(`${pathname}?${newParamsString}`);
        }
    }, [searchParams, queryClient, context, id, pathname, replace, fieldId]);

    return (
        <div className="p-3 min-w-80">
            <KVFieldComponent
                field={{
                    keys: keys,
                    multiple: true
                }}
                value={currentValue}
                setValue={handleValueChange}
            />
        </div>
    );
}