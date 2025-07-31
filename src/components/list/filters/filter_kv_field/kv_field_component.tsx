'use client'
import React from "react";
import { KVValue } from "@/types/collections";
import { useKVField } from "@/components/ui/kv_field/use_kv_field";
import KVPairsList from "@/components/ui/kv_field/kv_pairs_list";
import { Key } from "@/components/ui/kv_field/types";

type KVFieldComponentProps = {
    field: {
        keys?: string[];
        multiple?: boolean;
    };
    value: KVValue;
    setValue: (value: KVValue) => void;
}

export default function KVFieldComponent({
    field,
    value,
    setValue
}: KVFieldComponentProps) {
    // Create available keys with component and value structure
    const availableKeys: Key[] = React.useMemo(() => {
        if (!field.keys) return [];

        return field.keys.map(key => ({
            component: key,
            value: key
        }));
    }, [field.keys]);

    // Use the general hook for core KV field logic
    const {
        state,
        setState,
        availableKeys: filteredAvailableKeys,
        canAddLine
    } = useKVField({ value, field, setValue, availableKeys });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field component');
        return null;
    }

    return (
        <div className="flex flex-col space-y-0.5">
            <div className="flex flex-col p-0.5 gap-2">
                <KVPairsList
                    state={state}
                    setState={setState}
                    canAddLine={canAddLine}
                    availableKeys={filteredAvailableKeys}
                    addButtonText="Add key-value pair"
                />
            </div>
        </div>
    );
}