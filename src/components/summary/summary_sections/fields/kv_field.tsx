'use client'
import React from "react";
import Editing from "@/components/ui/fields/editing";
import NotEditing from "@/components/ui/fields/not_editing";
import Loading from "@/components/ui/fields/loading";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-kv";
import { Select } from "@/components/ui/select-kv";
import { Field } from "@/types/collections";
import { KVValue } from "@/types/collections";
import { getFormClassName } from "./field_helpers";
import Error from "@/components/ui/fields/error";
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_KEY = '';

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

type KVFieldState = {
    id: string;
    key: string;
    value: string;
}[]

const kvFieldStateToValue = (state: KVFieldState, keys: string[]) => {
    const value: KVValue = {};
    for (const line of state) {
        if (keys.includes(line.key)) {
            value[line.key] = line.value;
        }
    }
    return value;
}

const kvValueToFieldState = (kvValue: KVValue) => {
    const state: KVFieldState = [];
    const entries = Object.entries(kvValue);
    for (const [key, value] of entries) {
        state.push({
            id: crypto.randomUUID(),
            key,
            value
        });
    }

    // if the kvValue is empty, add a default key-value pair so a field appears
    if (entries.length === 0) {
        state.push({
            id: crypto.randomUUID(),
            key: DEFAULT_KEY,
            value: ''
        });
    }

    return state;
}

const getAvailableKeys = (state: KVFieldState, keys: string[]) => {
    const availableKeys = [...keys];
    for (const line of state) {
        if (availableKeys.includes(line.key)) {
            availableKeys.splice(availableKeys.indexOf(line.key), 1);
        }
    }
    return availableKeys;
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

    // keep track of the state of the field
    const [state, setState] = React.useState<KVFieldState>(
        kvValueToFieldState(value)
    );

    // update the value when the state changes
    React.useEffect(() => {
        const newValue = kvFieldStateToValue(state, field.keys || []);
        setValue(newValue);
    }, [state, setValue, field.keys]);

    // keep track of available keys to select from
    const [availableKeys, setAvailableKeys] = React.useState<string[]>(
        getAvailableKeys(state, field.keys || [])
    );

    React.useEffect(() => {
        setAvailableKeys(getAvailableKeys(state, field.keys || []));
    }, [state, field.keys]);

    const valueRefs = React.useRef<HTMLInputElement[]>([]);

    const setValueRef = (index: number, ref: HTMLInputElement | null) => {
        if (ref) {
            valueRefs.current[index] = ref;
        }
    }

    // Watch for focus on any value input to set editing state
    React.useEffect(() => {
        const handleFocus = () => setIsEditing(true);
        const handleBlur = () => setIsEditing(false);
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
    }, [valueRefs, setIsEditing]);

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    const handleAddLine = () => {
        setState([
            ...state,
            {
                id: crypto.randomUUID(),
                key: DEFAULT_KEY,
                value: ''
            }
        ]);
    }

    const canAddLine = () => {
        if (!field.multiple) {
            return false;
        }

        if (field.keys === undefined || field.keys.length === 0) {
            return false;
        }

        if (state.length >= field.keys.length) {
            return false;
        }

        return true;
    }

    const canDeleteLine = () => {
        if (!field.multiple) {
            return false;
        }

        if (state.length <= 1) {
            return false;
        }

        return true;
    }

    return (
        <form
            className={getFormClassName(isError, isPending, isEditing, true)}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2 w-full p-0.5">
                <div className="flex flex-col gap-2">
                    {state.map((line, index) => (
                        <KVLine
                            key={line.id}
                            id={line.id}
                            selectedKey={line.key}
                            state={state}
                            onChange={setState}
                            canDeleteLine={canDeleteLine}
                            availableKeys={availableKeys}
                            inputRef={(e) => setValueRef(index, e)}
                        />
                    ))}
                </div>
                {canAddLine() && <button
                    type="button"
                    className="w-full py-1.5 px-2 rounded-md border border-stone-200 bg-stone-50/50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 active:bg-stone-200 active:border-stone-400 transition-all duration-200 flex items-center justify-center gap-1.5 group"
                    aria-label="Add new key-value pair"
                    onClick={handleAddLine}
                >
                    <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-xs font-medium">Add pair</span>
                </button>}
            </div>
            <div className="flex flex-col">
                {isError ? (
                    error && <Error message={error.message} />
                ) : isPending ? (
                    <Loading />
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

function KVLine({
    id,
    selectedKey,
    state,
    onChange,
    canDeleteLine,
    availableKeys,
    inputRef,
}: {
    id: string;
    selectedKey: string;
    state: KVFieldState;
    onChange: (value: KVFieldState) => void;
    canDeleteLine: () => boolean;
    availableKeys: string[];
    inputRef: (e: HTMLInputElement | null) => void;
}) {

    const index = state.findIndex((line) => line.id === id);

    const onKeyChange = (newKey: string) => {
        const newState = [...state];
        newState[index].key = newKey;
        onChange(newState);
    }

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newState = [...state];
        newState[index].value = e.target.value;
        onChange(newState);
    }

    const handleDeleteLine = () => {
        const newState = [...state];
        newState.splice(index, 1);
        onChange(newState);
    }

    // include the selected key in the list of keys to select from
    // if the selected key is the default key, then we don't include it
    let keys = availableKeys;
    if (selectedKey !== DEFAULT_KEY && !keys.includes(selectedKey)) {
        keys = [selectedKey, ...availableKeys];
    }

    return (
        <div className="flex gap-1.5 items-center">
            <Select onValueChange={onKeyChange} value={selectedKey}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a key" />
                </SelectTrigger>
                <SelectContent>
                    {keys.map((key) => (
                        <SelectItem
                            key={key}
                            value={key}
                        >
                            {key}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {selectedKey && selectedKey !== DEFAULT_KEY ? (
                <Input
                    className="flex-1 h-8 rounded-md border-stone-300 bg-white text-stone-700 placeholder:text-stone-400 focus:ring-stone-400 focus:ring-1 focus:border-stone-400 hover:border-stone-400 hover:bg-stone-50/50 cursor-text transition-colors px-3"
                    value={state[index].value}
                    onChange={onValueChange}
                    placeholder="Enter value"
                    ref={inputRef}
                />
            ) : (
                <div className="flex-1 h-8 bg-stone-100 rounded-md border border-stone-300 flex items-center px-3 text-stone-500 text-sm">
                    Select a key to enter value
                </div>
            )}
            {canDeleteLine() && <button
                type="button"
                className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 active:text-red-600 active:bg-red-100 transition-colors"
                aria-label="Delete key-value pair"
                onClick={handleDeleteLine}
            >
                <Trash2 className="h-4 w-4" />
            </button>}
        </div>
    )
}