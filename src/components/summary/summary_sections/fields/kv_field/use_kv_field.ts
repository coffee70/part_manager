import React from "react";
import { Field, KVValue } from "@/types/collections";
import { 
    KVFieldState, 
    DEFAULT_KEY,
    kvFieldStateToValue,
    kvValueToFieldState,
    getAvailableKeys
} from "./types";

type UseKVFieldProps = {
    value: KVValue;
    field: Field;
    setValue: (value: KVValue) => void;
}

type UseKVFieldReturn = {
    state: KVFieldState;
    setState: (state: KVFieldState) => void;
    availableKeys: string[];
    handleAddLine: () => void;
    canAddLine: () => boolean;
    canDeleteLine: () => boolean;
}

export function useKVField({ value, field, setValue }: UseKVFieldProps): UseKVFieldReturn {
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

    return {
        state,
        setState,
        availableKeys,
        handleAddLine,
        canAddLine,
        canDeleteLine
    };
} 