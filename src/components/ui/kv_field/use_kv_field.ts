import React from "react";
import { 
    KVFieldState,
    Key
} from "./types";
import { getAvailableKeys } from "./helpers";

type UseKVFieldProps = {
    state: KVFieldState;
    field: {
        keys?: string[];
        multiple?: boolean;
    };
    keys: Key[];
}

type UseKVFieldReturn = {
    availableKeys: Key[];
    canAddLine: () => boolean;
}

export function useKVField({ state, field, keys }: UseKVFieldProps): UseKVFieldReturn {
    // Get available keys that aren't already used (no useEffect needed)
    const availableKeys = React.useMemo(() => 
        getAvailableKeys(state, keys), 
        [state, keys]
    );

    const canAddLine = () => {
        if (!field.multiple) {
            return false;
        }

        if (keys.length === 0) {
            return false;
        }

        if (state.length >= keys.length) {
            return false;
        }

        return true;
    }

    return {
        availableKeys,
        canAddLine,
    };
} 