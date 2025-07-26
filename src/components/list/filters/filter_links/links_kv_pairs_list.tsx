'use client'
import React from "react";
import { Plus } from "lucide-react";
import LinksKVLine from "./links_kv_line";
import { KVPairsListProps } from "@/components/summary/summary_sections/fields/kv_field/types";
import { useInstanceURL } from "@/hooks/url_metadata.hook";

type LinksKVPairsListProps = KVPairsListProps & {
    contextColors: Record<string, string>;
    contextIdToName: Record<string, string>;
}

export default function LinksKVPairsList({
    state,
    setState,
    canAddLine,
    handleAddLine,
    availableKeys,
    setValueRef,
    contextColors,
    contextIdToName
}: LinksKVPairsListProps) {
    const { context } = useInstanceURL();
    const contextLabel = context === 'models' ? 'model' : context === 'routers' ? 'router' : context;
    
    return (
        <>
            <div className="flex flex-col gap-2">
                {state.map((line, index) => (
                    <LinksKVLine
                        key={line.id}
                        id={line.id}
                        selectedKey={line.key}
                        state={state}
                        onChange={setState}
                        availableKeys={availableKeys}
                        inputRef={setValueRef ? (e) => setValueRef(index, e) : (_e) => {}}
                        contextColors={contextColors}
                        contextIdToName={contextIdToName}
                    />
                ))}
            </div>
            {canAddLine() && <button
                type="button"
                className="w-full py-1.5 px-2 rounded-md border border-stone-200 bg-stone-50/50 text-stone-500 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 active:bg-stone-200 active:border-stone-400 transition-all duration-200 flex items-center justify-center gap-1.5 group"
                aria-label="Add new key-value pair"
                onClick={handleAddLine}
            >
                <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-medium">Add {contextLabel} link</span>
            </button>}
        </>
    );
} 