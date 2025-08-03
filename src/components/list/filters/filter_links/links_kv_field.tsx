'use client'
import React from "react";
import { KVValue } from "@/types/collections";
import { useKVField } from "@/components/ui/kv_field/use_kv_field";
import KVPairsList from "@/components/ui/kv_field/kv_pairs_list";
import { Key } from "@/components/ui/kv_field/types";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { kvValueToFieldState, kvFieldStateToValue } from "@/components/ui/kv_field/helpers";

type LinksKVFieldProps = {
    field: {
        keys?: string[];
        multiple?: boolean;
    };
    value: KVValue;
    setValue: (value: KVValue) => void;
    contextColors: Record<string, string>;
    contextIdToName: Record<string, string>;
}

const ColorIndicator = ({ color }: { color: string }) => (
    <div
        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
        style={{ backgroundColor: color }}
    />
);

export default function LinksKVField({
    field,
    value,
    setValue,
    contextColors,
    contextIdToName
}: LinksKVFieldProps) {
    const { context } = useInstanceURL();
    const contextLabel = context === 'models' ? 'model' : context === 'routers' ? 'router' : context;

    // Create keys with component and value structure
    const keys: Key[] = React.useMemo(() => {
        if (!field.keys) return [];

        return field.keys.map(key => ({
            component: (
                <div className="flex items-center">
                    {contextColors[key] && <ColorIndicator color={contextColors[key]} />}
                    {contextIdToName[key] || key}
                </div>
            ),
            value: key
        }));
    }, [field.keys, contextColors, contextIdToName]);

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
        console.error('No keys for field, cannot render links kv field');
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
                    addButtonText={`Add ${contextLabel} link`}
                />
            </div>
        </div>
    );
} 