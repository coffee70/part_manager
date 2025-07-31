'use client'
import React from "react";
import { Field, KVValue } from "@/types/collections";
import { useKVField } from "@/components/ui/kv_field/use_kv_field";
import KVPairsList from "@/components/ui/kv_field/kv_pairs_list";

type KVFieldProps = {
    field: Field;
    value: KVValue;
    setValue: (value: KVValue) => void;
    label?: string;
    description?: string;
}

export default function KVField({
    field,
    value,
    setValue,
    label,
    description
}: KVFieldProps) {

    // Create available keys with component and value structure (both are the same for models)
    const availableKeys = React.useMemo(() => {
        if (!field.keys) return [];
        
        return field.keys.map(key => ({
            component: key,
            value: key
        }));
    }, [field.keys]);

    // Use the custom hook for core KV field logic
    const {
        state,
        setState,
        availableKeys: filteredAvailableKeys,
        canAddLine
    } = useKVField({ value, field, setValue, availableKeys });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    return (
        <div
            className="flex flex-col space-y-0.5"
            data-testid={`kv-field-${field.name}`}
        >
            {label && <label className='text-sm'>{label}</label>}
            <div className="flex flex-col p-0.5 gap-2">
                <KVPairsList
                    state={state}
                    setState={setState}
                    canAddLine={canAddLine}
                    availableKeys={filteredAvailableKeys}
                />
            </div>
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
    );
}