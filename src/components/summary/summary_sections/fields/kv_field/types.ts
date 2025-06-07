import { Field, KVValue } from "@/types/collections";

export const DEFAULT_KEY = '';

export type KVFieldState = {
    id: string;
    key: string;
    value: string;
}[]

export type KVFieldProps = {
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

export type KVPairsListProps = {
    state: KVFieldState;
    setState: (state: KVFieldState) => void;
    canAddLine: () => boolean;
    handleAddLine: () => void;
    canDeleteLine: () => boolean;
    availableKeys: string[];
    setValueRef?: (index: number, ref: HTMLInputElement | null) => void;
}

export type KVLineProps = {
    id: string;
    selectedKey: string;
    state: KVFieldState;
    onChange: (value: KVFieldState) => void;
    canDeleteLine: () => boolean;
    availableKeys: string[];
    inputRef: (e: HTMLInputElement | null) => void;
}

export const kvFieldStateToValue = (state: KVFieldState, keys: string[]): KVValue => {
    const value: KVValue = {};
    for (const line of state) {
        if (keys.includes(line.key)) {
            value[line.key] = line.value;
        }
    }
    return value;
}

export const kvValueToFieldState = (kvValue: KVValue): KVFieldState => {
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

export const getAvailableKeys = (state: KVFieldState, keys: string[]): string[] => {
    const availableKeys = [...keys];
    for (const line of state) {
        if (availableKeys.includes(line.key)) {
            availableKeys.splice(availableKeys.indexOf(line.key), 1);
        }
    }
    return availableKeys;
}

export const compareKVFieldStates = (a: KVFieldState, b: KVFieldState): boolean => {
    if (a.length !== b.length) return false;

    return a.every((item, index) =>
        item.key === b[index].key &&
        item.value === b[index].value
    );
}; 

export const compareKVValues = (a: KVValue, b: KVValue): boolean => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(key => 
        a[key] === b[key] && 
        bKeys.includes(key)
    );
};
