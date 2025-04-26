'use client'
import React from 'react'
import { Field } from '@/types/collections'
import Error from '@/components/ui/fields/error'
import Loading from '@/components/ui/fields/loading'
import Editing from '@/components/ui/fields/editing'
import NotEditing from '@/components/ui/fields/not_editing'
import { Input } from '@/components/ui/input'
import { getFormClassName } from './field_helpers'

type Props = {
    field: Field & {
        value?: string | string[];
    };
    value: string | string[];
    isEditing: boolean;
    isError: boolean;
    isPending: boolean;
    error: Error | null;
    setIsEditing: (isEditing: boolean) => void;
    setValue: (value: string | string[]) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function InputField(props: Props) {
    const {
        field,  
        value,
        isEditing,
        isError,
        isPending,
        error,
        setIsEditing,
        setValue,
        handleSubmit
    } = props;

    React.useEffect(() => {
        setValue(field.value ?? '')
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

    return (
        <form
            className={getFormClassName(isError, isPending, isEditing)}
            onSubmit={handleSubmit}
        >
            <Input
                id={field.name}
                ref={inputRef}
                className='no-icon'
                type={field.type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={(e) => handleBlur(e, submitRef.current)}
            />
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

