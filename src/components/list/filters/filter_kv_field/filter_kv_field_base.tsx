'use client'
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQueryClient } from "@tanstack/react-query";
import { instanceKeys } from "@/lib/query_keys";
import { KVValue } from "@/types/collections";
import KVFieldComponent from "./kv_field_component";
import { useDebouncedCallback } from "use-debounce";

type Props = {
    fieldId: string;
    keys: string[];
}

export default function KVFieldFilterBase({ fieldId, keys }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

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
    const [value, setValue] = React.useState<KVValue>(currentValue);

    // Debounced URL/search param update
    const onDebouncedChange = useDebouncedCallback((nextValue: KVValue) => {
        const params = new URLSearchParams(searchParams);
        const originalParamsString = params.toString();

        const customFieldParam = params.get('custom-field');
        let customFields: Record<string, string> = {};

        if (customFieldParam) {
            try {
                customFields = JSON.parse(customFieldParam);
            } catch {
                customFields = {};
            }
        }

        const hasValues = Object.values(nextValue).some(v => v && v.trim() !== '');

        if (hasValues) {
            customFields[fieldId] = JSON.stringify(nextValue);
        } else {
            delete customFields[fieldId];
        }

        if (Object.keys(customFields).length > 0) {
            params.set('custom-field', JSON.stringify(customFields));
        } else {
            params.delete('custom-field');
        }

        const newParamsString = params.toString();
        if (originalParamsString !== newParamsString) {
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) });
            const newUrl = `${pathname}?${newParamsString}`;
            push(newUrl);
        }
    }, 300);

    const onImmediateChange = React.useCallback((nextValue: KVValue) => {
        setValue(nextValue);
        onDebouncedChange(nextValue);
    }, [onDebouncedChange]);

    return (
        <div className="p-3 min-w-80">
            <KVFieldComponent
                field={{
                    keys: keys,
                    multiple: true
                }}
                value={value}
                setValue={onImmediateChange}
            />
        </div>
    );
}