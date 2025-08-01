'use client'
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-kv";
import { Trash2 } from "lucide-react";
import { DEFAULT_KEY, KVLineProps } from "./types";

export default function KVLine({
    id,
    selectedKey,
    state,
    onChange,
    availableKeys,
    inputRef,
}: KVLineProps) {

    const index = state.findIndex((line) => line.id === id);

    const onKeyChange = (newKeyValue: string) => {
        // Find the Key object that corresponds to this value
        const newKey = availableKeys.find(k => k.value === newKeyValue) || selectedKey;
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

    const keys = selectedKey.value === DEFAULT_KEY.value 
        ? availableKeys
        : availableKeys.find(key => key.value === selectedKey.value)
            ? availableKeys 
            : [selectedKey, ...availableKeys];

    return (
        <div className="flex gap-1.5 items-center">
            <Select onValueChange={onKeyChange} value={selectedKey.value}>
                <SelectTrigger
                    className="w-[200px]"
                    data-testid={`kv-line-key-select-trigger-${selectedKey.value}-${index}`}
                >
                    <SelectValue
                        placeholder="Select a key"
                        data-testid={`kv-line-key-select-value-${selectedKey.value}-${index}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    {keys.map((key) => (
                        <SelectItem
                            key={key.value}
                            value={key.value}
                        >
                            {key.component}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {selectedKey && selectedKey.value !== DEFAULT_KEY.value ? (
                <Input
                    className="flex-1 h-8 rounded-md border-stone-300 bg-white text-stone-700 placeholder:text-stone-400 focus:ring-stone-400 focus:ring-1 focus:border-stone-400 hover:border-stone-400 hover:bg-stone-50/50 cursor-text transition-colors px-3"
                    value={state[index].value}
                    onChange={onValueChange}
                    placeholder="Enter value"
                    ref={inputRef}
                    data-testid={`kv-line-value-input-${selectedKey.value}-${index}`}
                />
            ) : (
                <div
                    className="flex-1 h-8 bg-stone-100 rounded-md border border-stone-300 flex items-center px-3 text-stone-500 text-sm truncate"
                    data-testid={`kv-line-value-placeholder-${selectedKey.value}-${index}`}
                >
                    Select a key to enter value
                </div>
            )}
            <button
                type="button"
                className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 active:text-red-600 active:bg-red-100 transition-colors"
                aria-label="Delete key-value pair"
                onClick={handleDeleteLine}
                data-testid={`delete-kv-line-button-${selectedKey.value}-${index}`}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
} 