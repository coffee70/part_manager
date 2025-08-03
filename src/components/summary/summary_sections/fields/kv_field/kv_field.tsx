'use client'
import React from "react";
import Editing from "@/components/ui/fields/editing";
import NotEditing from "@/components/ui/fields/not_editing";
import Loading from "@/components/ui/fields/loading";
import Error from "@/components/ui/fields/error";
import { getFormClassName } from "../field_helpers";
import KVPairsList from "@/components/ui/kv_field/kv_pairs_list";
import { useKVField } from "@/components/ui/kv_field/use_kv_field";

import {
    kvValueToFieldState,
    kvFieldStateToValue,
    compareKVFieldStates,
    compareKVValues
} from "@/components/ui/kv_field/helpers";
import { Field, KVValue } from "@/types/collections";

type Props = {
    field: Field & {
        value?: KVValue;
    };
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    onSubmit: (value: KVValue) => void;
    isError: boolean;
    isPending: boolean;
    error: Error | null;
}

export default function KVField(props: Props) {
    const {
        field,
        isEditing,
        setIsEditing,
        onSubmit,
        isError,
        isPending,
        error
    } = props;

    // Create keys with component and value structure (both are the same for summary)
    const keys = React.useMemo(() => {
        if (!field.keys) return [];

        return field.keys.map((key: string) => ({
            component: key,
            value: key
        }));
    }, [field.keys]);

    // Base value from field.value (server source of truth)
    const baseValue = React.useMemo(() => field.value || {}, [field.value]);
    
    // Convert to field state for editing
    const baseState = React.useMemo(() => {
        const state = kvValueToFieldState(baseValue, keys);
        return state.length === 0 ? kvValueToFieldState({ '': '' }, keys) : state;
    }, [baseValue, keys]);

    // Local editing state - resets when baseState changes and not editing
    const [editingState, setEditingState] = React.useState(() => baseState);

    // Reset editing state when base changes (but only when not actively editing)
    const resetKey = React.useMemo(() => 
        JSON.stringify(baseValue), [baseValue]
    );
    
    const [lastResetKey, setLastResetKey] = React.useState(resetKey);
    
    if (resetKey !== lastResetKey && !isEditing) {
        setEditingState(baseState);
        setLastResetKey(resetKey);
    }

    // Use base state when not editing, editing state when editing
    const currentState = isEditing ? editingState : baseState;

    // Handle state changes during editing
    const handleStateChange = React.useCallback((newState: typeof currentState) => {
        setEditingState(newState);
        if (!isEditing) {
            setIsEditing(true);
        }
    }, [isEditing, setIsEditing]);

    // Check if current editing state is different from base
    const isDirty = !compareKVFieldStates(editingState, baseState);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const keyValues = keys.map(k => k.value);
        const newValue = kvFieldStateToValue(editingState, keyValues);
        onSubmit(newValue);
    }

    // Use the custom hook for core KV field logic
    const {
        availableKeys,
        canAddLine
    } = useKVField({ state: currentState, field, keys });

    // Ref management for focus/blur behavior
    const valueRefs = React.useRef<HTMLInputElement[]>([]);

    const setValueRef = (index: number, ref: HTMLInputElement | null) => {
        if (ref) {
            valueRefs.current[index] = ref;
        }
    }

    // Watch for focus on any value input to set editing state
    React.useEffect(() => {
        const handleFocus = () => setIsEditing(true);
        const handleBlur = () => {
            if (!isDirty) {
                setIsEditing(false);
            }
        }
        const inputs = valueRefs.current;

        inputs.forEach(ref => {
            if (ref) {
                ref.addEventListener('focus', handleFocus);
                ref.addEventListener('blur', handleBlur);
            }
        });

        return () => {
            inputs.forEach(ref => {
                if (ref) {
                    ref.removeEventListener('focus', handleFocus);
                    ref.removeEventListener('blur', handleBlur);
                }
            });
        };
    }, [setIsEditing, isDirty]);

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    return (
        <form
            className={getFormClassName(isError, isPending, isEditing, true)}
            onSubmit={handleSubmit}
            data-testid={`kv-field-${field.name}`}
        >
            <div className="flex flex-col gap-2 w-full p-0.5">
                <KVPairsList
                    state={currentState}
                    setState={handleStateChange}
                    canAddLine={canAddLine}
                    availableKeys={availableKeys}
                    setValueRef={setValueRef}
                />
            </div>
            <div className="flex flex-col">
                {isError ? (
                    error && <Error message={error.message} />
                ) : isPending ? (
                    <Loading aria-label={`Saving field ${field.name}`} />
                ) : isEditing ? (
                    <Editing aria-label={`Save field ${field.name}`} />
                ) : (
                    <NotEditing
                        onClick={() => setIsEditing(true)}
                        aria-label={`Edit field ${field.name}`}
                    />
                )}
            </div>
        </form>
    )
} 