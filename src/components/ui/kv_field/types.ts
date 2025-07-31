import { Field, KVValue } from "@/types/collections";
import React from "react";

export type Key = {
    component: React.ReactNode;
    value: string;
}

export const DEFAULT_KEY: Key = {
    component: '',
    value: ''
};

export type KVFieldState = {
    id: string;
    key: Key;
    value: string;
}[]

export type KVFieldProps = {
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

export type KVPairsListProps = {
    state: KVFieldState;
    setState: (state: KVFieldState) => void;
    canAddLine: () => boolean;
    availableKeys: Key[];
    setValueRef?: (index: number, ref: HTMLInputElement | null) => void;
    addButtonText?: string;
}

export type KVLineProps = {
    id: string;
    selectedKey: Key;
    state: KVFieldState;
    onChange: (value: KVFieldState) => void;
    availableKeys: Key[];
    inputRef: (e: HTMLInputElement | null) => void;
} 