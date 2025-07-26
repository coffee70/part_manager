'use client'
import React from "react";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-kv";
import { Select } from "@/components/ui/select-kv";
import { Trash2 } from "lucide-react";
import { DEFAULT_KEY, KVLineProps } from "@/components/summary/summary_sections/fields/kv_field/types";
import { useInstanceURL } from "@/hooks/url_metadata.hook";

type LinksKVLineProps = KVLineProps & {
    contextColors: Record<string, string>;
    contextIdToName: Record<string, string>;
}

export default function LinksKVLine({
    id,
    selectedKey,
    state,
    onChange,
    availableKeys,
    inputRef,
    contextColors,
    contextIdToName,
}: LinksKVLineProps) {

    const { context } = useInstanceURL();
    const contextLabel = context === 'models' ? 'model' : context === 'routers' ? 'router' : context;

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

    const ColorIndicator = ({ color }: { color: string }) => (
        <div 
            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
            style={{ backgroundColor: color }}
        />
    );

    return (
        <div className="flex gap-1.5 items-center">
            <Select onValueChange={onKeyChange} value={selectedKey}>
                <SelectTrigger
                    className="w-[200px]"
                    data-testid={`kv-line-key-select-trigger-${selectedKey}-${index}`}
                >
                    <SelectValue
                        placeholder={`Select a ${contextLabel}`}
                        data-testid={`kv-line-key-select-value-${selectedKey}-${index}`}
                    />
                </SelectTrigger>
                <SelectContent>
                    {keys.map((key) => (
                        <SelectItem
                            key={key}
                            value={key}
                        >
                            <div className="flex items-center">
                                {contextColors[key] && <ColorIndicator color={contextColors[key]} />}
                                {contextIdToName[key] || key}
                            </div>
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
                    data-testid={`kv-line-value-input-${selectedKey}-${index}`}
                />
            ) : (
                <div
                    className="flex-1 h-8 bg-stone-100 rounded-md border border-stone-300 flex items-center px-3 text-stone-500 text-sm truncate"
                    data-testid={`kv-line-value-placeholder-${selectedKey}-${index}`}
                >
                    Select a {contextLabel} to enter value
                </div>
            )}
            <button
                type="button"
                className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 active:text-red-600 active:bg-red-100 transition-colors"
                aria-label="Delete key-value pair"
                onClick={handleDeleteLine}
                data-testid={`delete-kv-line-button-${selectedKey}-${index}`}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
} 