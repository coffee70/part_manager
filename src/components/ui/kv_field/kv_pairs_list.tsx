'use client'
import React from "react";
import { Plus } from "lucide-react";
import KVLine from "./kv_line";
import { KVPairsListProps, DEFAULT_KEY } from "./types";

export default function KVPairsList({
    state,
    setState,
    canAddLine,
    availableKeys,
    onFocus,
    onBlur,
    onMouseDown,
    addButtonText = "Add pair"
}: KVPairsListProps) {
    
    const handleAddLine = () => {
        const newState = [...state, {
            id: crypto.randomUUID(),
            key: DEFAULT_KEY,
            value: ''
        }];
        setState(newState);
    };
    
    return (
        <>
            <div className="flex flex-col gap-2">
                {state.map((line) => (
                    <KVLine
                        key={line.id}
                        id={line.id}
                        selectedKey={line.key}
                        state={state}
                        onChange={setState}
                        availableKeys={availableKeys}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onMouseDown={onMouseDown}
                    />
                ))}
            </div>
            {canAddLine() && <button
                type="button"
                className="w-full py-1.5 px-2 rounded-md border border-subtle bg-background/50 text-weak hover:bg-hover hover:text-text hover:border-border active:bg-border-strong active:border-border-strong transition-all duration-200 flex items-center justify-center gap-1.5 group"
                aria-label="Add new key-value pair"
                onClick={handleAddLine}
            >
                <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-medium">{addButtonText}</span>
            </button>}
        </>
    );
} 