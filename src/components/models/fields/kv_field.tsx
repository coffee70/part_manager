'use client'
import React from "react";
import { Field, KVValue } from "@/types/collections";
import { useKVField } from "@/components/summary/summary_sections/fields/kv_field/use_kv_field";
import KVPairsList from "@/components/summary/summary_sections/fields/kv_field/kv_pairs_list";
import { cn } from "@/lib/utils";

type KVFieldProps = {
    field: Field;
    value: KVValue;
    setValue: (value: KVValue) => void;
    className?: string;
}

export default function KVField({
    field,
    value,
    setValue,
    className = ""
}: KVFieldProps) {
    
    // Use the custom hook for core KV field logic
    const {
        state,
        setState,
        availableKeys,
        handleAddLine,
        canAddLine,
        canDeleteLine
    } = useKVField({ value, field, setValue });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            <KVPairsList
                state={state}
                setState={setState}
                canAddLine={canAddLine}
                handleAddLine={handleAddLine}
                canDeleteLine={canDeleteLine}
                availableKeys={availableKeys}
            />
        </div>
    );
}