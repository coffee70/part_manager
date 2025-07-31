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
    compareKVFieldStates
} from "@/components/ui/kv_field/helpers";
import { Field, KVValue } from "@/types/collections";

type Props = {
    field: Field & {
        value?: KVValue;
    };
    value: KVValue;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    setValue: (value: KVValue) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isError: boolean;
    isPending: boolean;
    error: Error | null;
}

export default function KVField(props: Props) {
    const {
        field,
        value,
        isEditing,
        setIsEditing,
        setValue,
        handleSubmit,
        isError,
        isPending,
        error
    } = props;

    // Create available keys with component and value structure (both are the same for summary)
    const availableKeys = React.useMemo(() => {
        if (!field.keys) return [];

        return field.keys.map((key: string) => ({
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

    // keep track of initial state for comparison (editing/dirty state management)
    const cleanState = React.useMemo(() => kvValueToFieldState(field.value || {}, availableKeys), [field.value, availableKeys]);
    const [isDirty, setIsDirty] = React.useState(false);

    // compare states and update editing status
    React.useEffect(() => {
        if (!compareKVFieldStates(state, cleanState)) {
            setIsEditing(true);
            setIsDirty(true);
        } else {
            setIsEditing(false);
            setIsDirty(false);
        }
    }, [state, cleanState, setIsEditing, setIsDirty]);

    // update the state when the field value changes
    React.useEffect(() => {
        setState(kvValueToFieldState(field.value || {}, availableKeys));
    }, [field.value, setState, availableKeys]);

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
    }, [valueRefs, setIsEditing, isDirty]);

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
                    state={state}
                    setState={setState}
                    canAddLine={canAddLine}
                    availableKeys={filteredAvailableKeys}
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