import React from "react";
import { KVValue } from "@/types/collections";
import { 
    KVFieldState,
    Key
} from "./types";
import {
    kvFieldStateToValue,
    kvValueToFieldState,
    getAvailableKeys,
    compareKVValues,
    addEntryToKVFieldState
} from "./helpers";

type UseKVFieldProps = {
    value: KVValue;
    field: {
        keys?: string[];
        multiple?: boolean;
    };
    setValue: (value: KVValue) => void;
    availableKeys: Key[];
}

type UseKVFieldReturn = {
    state: KVFieldState;
    setState: (state: KVFieldState) => void;
    availableKeys: Key[];
    handleAddLine: () => void;
    canAddLine: () => boolean;
}

export function useKVField({ value, field, setValue, availableKeys: initialAvailableKeys }: UseKVFieldProps): UseKVFieldReturn {
    // keep track of the state of the field
    const [state, setState] = React.useState<KVFieldState>(
        kvValueToFieldState(value, initialAvailableKeys)
    );

    // update the value when the state changes
    React.useEffect(() => {
        const keys = initialAvailableKeys.map(k => k.value);
        const newValue = kvFieldStateToValue(state, keys);
        if (!compareKVValues(value, newValue)) {
            setValue(newValue);
        }
    }, [state, setValue, initialAvailableKeys, value]);

    // keep track of available keys to select from
    const [availableKeys, setAvailableKeys] = React.useState<Key[]>(
        getAvailableKeys(state, initialAvailableKeys)
    );

    React.useEffect(() => {
        setAvailableKeys(getAvailableKeys(state, initialAvailableKeys));
    }, [state, initialAvailableKeys]);

    // always ensure the state has a default key-value pair if
    // the state is empty
    React.useEffect(() => {
        if (state.length === 0) {
            setState(addEntryToKVFieldState(state));
        }
    }, [state, setState]);

    const handleAddLine = () => {
        setState(addEntryToKVFieldState(state));
    }

    const canAddLine = () => {
        if (!field.multiple) {
            return false;
        }

        if (initialAvailableKeys.length === 0) {
            return false;
        }

        if (state.length >= initialAvailableKeys.length) {
            return false;
        }

        return true;
    }

    return {
        state,
        setState,
        availableKeys,
        handleAddLine,
        canAddLine,
    };
} 