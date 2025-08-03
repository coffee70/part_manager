'use client'
import React from "react";
import { KVValue } from "@/types/collections";
import { useKVField } from "@/components/ui/kv_field/use_kv_field";
import KVPairsList from "@/components/ui/kv_field/kv_pairs_list";
import { Key } from "@/components/ui/kv_field/types";
import { kvValueToFieldState, kvFieldStateToValue } from "@/components/ui/kv_field/helpers";

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
    // Create keys with component and value structure
    const keys: Key[] = React.useMemo(() => {
        if (!field.keys) return [];

        return field.keys.map(key => ({
            component: key,
            value: key
        }));
    }, [field.keys]);

    // Convert KVValue to KVFieldState and manage local state
    const [state, setState] = React.useState(() => {
        const initialState = kvValueToFieldState(value, keys);
        // Ensure there's always a default entry if empty (server data empty case)
        return initialState.length === 0 ? kvValueToFieldState({ '': '' }, keys) : initialState;
    });

    // Convert state changes back to KVValue and call setValue
    const handleStateChange = React.useCallback((newState: typeof state) => {
        setState(newState);
        const keyValues = keys.map(k => k.value);
        const newValue = kvFieldStateToValue(newState, keyValues);
        setValue(newValue);
    }, [setValue, keys]);

    // Use the general hook for core KV field logic
    const {
        availableKeys,
        canAddLine
    } = useKVField({ state, field, keys });

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field component');
        return null;
    }

    return (
        <div className="flex flex-col space-y-0.5">
            <div className="flex flex-col p-0.5 gap-2">
                <KVPairsList
                    state={state}
                    setState={handleStateChange}
                    canAddLine={canAddLine}
                    availableKeys={availableKeys}
                    addButtonText="Add key-value pair"
                />
            </div>
        </div>
    );
}