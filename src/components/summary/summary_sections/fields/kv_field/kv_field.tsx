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
import { KVFieldState } from "@/components/ui/kv_field/types";

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
    isDirty: boolean;
    setIsDirty: (isDirty: boolean) => void;
}

export default function KVField(props: Props) {
    const {
        field,
        isEditing,
        setIsEditing,
        onSubmit,
        isError,
        isPending,
        error,
        isDirty,
        setIsDirty
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

    // Local editing state
    const [editingState, setEditingState] = React.useState(() => baseState);

    // Reset editing state when base state changes
    React.useEffect(() => {
        setEditingState(() => baseState);
    }, [baseState]);

    const [isFocused, setIsFocused] = React.useState(false);

    // Handle state changes during editing
    const handleStateChange = React.useCallback((newState: KVFieldState) => {
        setEditingState(newState);
        if (!compareKVFieldStates(newState, baseState)) {
            setIsDirty(true);
            setIsEditing(true);
        } else {
            setIsDirty(false);
            if (!isFocused) {
                setIsEditing(false);
            }
        }
    }, [baseState, setIsEditing, isFocused, setIsDirty]);

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
    } = useKVField({ state: editingState, field, keys });

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setIsEditing(true);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!isDirty) {
            setIsEditing(false);
        }
        setIsFocused(false);
    }

    // Intentionally do not toggle editing on mouse down to avoid pre-focus rerenders that remount inputs

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
                    state={editingState}
                    setState={handleStateChange}
                    canAddLine={canAddLine}
                    availableKeys={availableKeys}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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