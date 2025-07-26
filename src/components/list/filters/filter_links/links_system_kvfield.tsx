'use client'
import React from "react";
import { KVValue } from "@/types/collections";
import { useKVField } from "@/components/summary/summary_sections/fields/kv_field/use_kv_field";
import LinksKVPairsList from "./links_kv_pairs_list";

type LinksSystemKVFieldProps = {
    field: {
        keys?: string[];
        multiple?: boolean;
    };
    value: KVValue;
    setValue: (value: KVValue) => void;
    contextColors: Record<string, string>;
    contextIdToName: Record<string, string>;
}

export default function LinksSystemKVField({
    field,
    value,
    setValue,
    contextColors,
    contextIdToName
}: LinksSystemKVFieldProps) {

    // Use the custom hook for core KV field logic
    const {
        state,
        setState,
        availableKeys,
        handleAddLine,
        canAddLine
    } = useKVField({ value, field, setValue });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render links system kv field');
        return null;
    }

    return (
        <div className="flex flex-col space-y-0.5">
            <div className="flex flex-col p-0.5 gap-2">
                <LinksKVPairsList
                    state={state}
                    setState={setState}
                    canAddLine={canAddLine}
                    handleAddLine={handleAddLine}
                    availableKeys={availableKeys}
                    contextColors={contextColors}
                    contextIdToName={contextIdToName}
                />
            </div>
        </div>
    );
} 