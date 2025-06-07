'use client'
import React from "react";
import { Field, KVValue } from "@/types/collections";
import { useKVField } from "@/components/summary/summary_sections/fields/kv_field/use_kv_field";
import KVPairsList from "@/components/summary/summary_sections/fields/kv_field/kv_pairs_list";

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

    // Use the custom hook for core KV field logic
    const {
        state,
        setState,
        availableKeys,
        handleAddLine,
        canAddLine
    } = useKVField({ value, field, setValue });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    return (
        <div className="flex flex-col space-y-0.5">
            {label && <label className='text-sm'>{label}</label>}
            <div className="flex flex-col p-0.5 gap-2">
            <KVPairsList
                state={state}
                setState={setState}
                canAddLine={canAddLine}
                handleAddLine={handleAddLine}
                availableKeys={availableKeys}
            />
            </div>
            {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
    );
}