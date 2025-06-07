import React from "react";
import { Field, KVValue } from "@/types/collections";
import { 
    KVFieldState, 
    kvFieldStateToValue,
    kvValueToFieldState,
    getAvailableKeys,
    compareKVValues,
    addEntryToKVFieldState
} from "./types";

type UseKVFieldProps = {
    value: KVValue;
    field: Field & {
        value?: KVValue;
    };
    setValue: (value: KVValue) => void;
}

type UseKVFieldReturn = {
    state: KVFieldState;
    setState: (state: KVFieldState) => void;
    availableKeys: string[];
    handleAddLine: () => void;
    canAddLine: () => boolean;
}

export function useKVField({ value, field, setValue }: UseKVFieldProps): UseKVFieldReturn {
    // keep track of the state of the field
    const [state, setState] = React.useState<KVFieldState>(
        kvValueToFieldState(value)
    );

    // update the value when the state changes
    React.useEffect(() => {
        const newValue = kvFieldStateToValue(state, field.keys || []);
        if (!compareKVValues(value, newValue)) {
            setValue(newValue);
        }
    }, [state, setValue, field.keys, value]);

    // keep track of available keys to select from
    const [availableKeys, setAvailableKeys] = React.useState<string[]>(
        getAvailableKeys(state, field.keys || [])
    );

    React.useEffect(() => {
        setAvailableKeys(getAvailableKeys(state, field.keys || []));
    }, [state, field.keys]);

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

        if (field.keys === undefined || field.keys.length === 0) {
            return false;
        }

        if (state.length >= field.keys.length) {
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