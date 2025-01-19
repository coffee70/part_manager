'use client'
import React from 'react'

export function useIsEditing() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [isEditing])

    React.useEffect(() => {
        const _inputRef = inputRef.current;
        _inputRef?.addEventListener('focus', () => setIsEditing(true))

        return () => {
            _inputRef?.removeEventListener('focus', () => setIsEditing(false))
        }
    })

    return {
        inputRef,
        isEditing,
        setIsEditing,
    }
}