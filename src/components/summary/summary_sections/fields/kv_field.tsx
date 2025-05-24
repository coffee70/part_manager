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

    const [lines, setLines] = React.useState<number>(1);
    const [availableKeys, setAvailableKeys] = React.useState<string[]>(field.keys ?? []);
    const [lineData, setLineData] = React.useState<Array<{id: string, key?: string}>>([{id: '0'}]);
    const [nextId, setNextId] = React.useState<number>(1);

    React.useEffect(() => {
        
    })

    const onKeyChange = (lineId: string, oldKey: string | undefined, newKey: string) => {
        // Remove the new key from available keys
        setAvailableKeys(prev => prev.filter(k => k !== newKey));
        // Add the old key back to available keys if it exists
        if (oldKey) setAvailableKeys(prev => [...prev, oldKey]);
        
        // Update the line data
        setLineData(prev => prev.map(line => 
            line.id === lineId ? { ...line, key: newKey } : line
        ));
        setIsEditing(true);
    }

    const handleAddLine = () => {
        if (!field.keys) return;
        if (lines >= field.keys.length) return;
        setLines(prev => prev + 1);
        setLineData(prev => [...prev, {id: nextId.toString()}]);
        setNextId(prev => prev + 1);
    }

    const handleDeleteLine = (lineId: string) => {
        const lineToDelete = lineData.find(line => line.id === lineId);
        const keyToDelete = lineToDelete?.key;
        
        if (keyToDelete) {
            // Add the deleted key back to available keys
            setAvailableKeys(prev => [...prev, keyToDelete]);
            
            // Create new value object without the deleted key
            const newValue = { ...value };
            delete newValue[keyToDelete];
            setValue(newValue);
        }
        
        // Remove the line from lineData array
        setLineData(prev => prev.filter(line => line.id !== lineId));
        
        // Decrease the line count
        setLines(prev => prev - 1);
    }

    const linesToRender = () => {
        if (field.keys === undefined || field.keys.length === 0) {
            console.error('No keys for field, cannot render kv field', field.name);
            return 0;
        }

        if (!field.multiple) {
            return 1;
        }

        return Math.min(lines, field.keys.length);
    }

    React.useEffect(() => {
        setValue(field.value ?? {});
    }, [field.value, setValue]);

    const submitRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const input = inputRef.current;
        if (isEditing) input?.focus();
        else input?.blur();
    }, [isEditing]);

    const handleBlur = (e: React.FocusEvent, target: HTMLElement | null) => {
        if (e.relatedTarget !== target) {
            setIsEditing(false);
        }
    };

    if (field.keys === undefined || field.keys.length === 0) {
        console.error('No keys for field, cannot render kv field', field.name);
        return null;
    }

    // narrowed type for keys since the compiler doesnt infer it correctly
    // in the map closure below
    const currentKeys = field.keys;

    return (
        <form
            className={getFormClassName(isError, isPending, isEditing, true)}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2 w-full p-0.5">
                <div className="flex flex-col gap-2">
                    {lineData.slice(0, linesToRender()).map((line) => (
                        <KVLine
                            key={line.id}
                            lineId={line.id}
                            selectedKey={line.key}
                            availableKeys={availableKeys}
                            value={value}
                            onChange={setValue}
                            onKeyChange={onKeyChange}
                            onDelete={() => handleDeleteLine(line.id)}
                            showDelete={!!field.multiple && lines > 1}
                        />
                    ))}
                </div>
                {lines < currentKeys.length && !!field.multiple && (
                    <button 
                        onClick={handleAddLine}
                        className="w-full py-1.5 px-2 rounded-md border border-stone-200 bg-stone-50/50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 active:bg-stone-200 active:border-stone-400 transition-all duration-200 flex items-center justify-center gap-1.5 group"
                        aria-label="Add new key-value pair"
                    >
                        <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium">Add pair</span>
                    </button>
                )}
            </div>
            <div className="flex flex-col">
                {isError ? (
                    error && <Error message={error.message} />
                ) : isPending ? (
                    <Loading />
                ) : isEditing ? (
                    <Editing
                        ref={submitRef}
                        onBlur={(e) => handleBlur(e, inputRef.current)}
                        aria-label={`Save field ${field.name}`}
                    />
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
    lineId,
    selectedKey,
    availableKeys,
    value,
    onChange,
    onKeyChange,
    onDelete,
    showDelete
}: {
    lineId: string;
    selectedKey: string | undefined;
    availableKeys: string[];
    value: KVValue;
    onChange: (value: KVValue) => void;
    onKeyChange: (lineId: string, oldKey: string | undefined, newKey: string) => void;
    onDelete: () => void;
    showDelete: boolean;
}) {
    const handleKeyChange = (newKey: string) => {
        onKeyChange(lineId, selectedKey, newKey);
    }

    let keys = availableKeys;
    if (selectedKey) keys = [...keys, selectedKey];

    return (
        <div className="flex gap-1.5 items-center">
            <Select onValueChange={handleKeyChange} value={selectedKey}>
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
            {selectedKey ? (
                <Input
                    className="flex-1 h-8 rounded-md border-stone-300 bg-white text-stone-700 placeholder:text-stone-400 focus:ring-stone-400 focus:ring-1 focus:border-stone-400 hover:border-stone-400 hover:bg-stone-50/50 cursor-text transition-colors px-3"
                    value={value[selectedKey] || ''}
                    onChange={(e) => onChange({ ...value, [selectedKey]: e.target.value })}
                    placeholder="Enter value"
                />
            ) : (
                <div className="flex-1 h-8 bg-stone-100 rounded-md border border-stone-300 flex items-center px-3 text-stone-500 text-sm">
                    Select a key to enter value
                </div>
            )}
            {showDelete && (
                <button
                    onClick={onDelete}
                    className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 active:text-red-600 active:bg-red-100 transition-colors"
                    aria-label="Delete key-value pair"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}