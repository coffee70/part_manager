import { KVValue } from "@/types/collections";
import { KVFieldState, Key, DEFAULT_KEY } from "./types";

export const kvFieldStateToValue = (state: KVFieldState, keys: string[]): KVValue => {
    const value: KVValue = {};
    for (const line of state) {
        if (keys.includes(line.key.value)) {
            value[line.key.value] = line.value;
        }
    }
    return value;
}

export const kvValueToFieldState = (kvValue: KVValue, availableKeys: Key[]): KVFieldState => {
    let state: KVFieldState = [];
    const entries = Object.entries(kvValue);
    for (const [keyValue, value] of entries) {
        // Find the corresponding Key object for this string value
        const keyObj = availableKeys.find(k => k.value === keyValue) || {
            component: keyValue,
            value: keyValue
        };
        state = addEntryToKVFieldState(state, keyObj, value);
    }

    // if the kvValue is empty, add a default key-value pair so a field appears
    if (entries.length === 0) {
        state = addEntryToKVFieldState(state);
    }

    return state;
}

export const addEntryToKVFieldState = (state: KVFieldState, key?: Key, value?: string): KVFieldState => {
    return [
        ...state,
        {
            id: crypto.randomUUID(),
            key: key || DEFAULT_KEY,
            value: value || ''
        }
    ];
}

export const getAvailableKeys = (state: KVFieldState, availableKeys: Key[]): Key[] => {
    const result = [...availableKeys];
    for (const line of state) {
        const index = result.findIndex(key => key.value === line.key.value);
        if (index !== -1) {
            result.splice(index, 1);
        }
    }
    return result;
}

export const compareKVFieldStates = (a: KVFieldState, b: KVFieldState): boolean => {
    if (a.length !== b.length) return false;

    return a.every((item, index) =>
        item.key.value === b[index].key.value &&
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

 