'use client'
import React from 'react';

interface PromiseHandlers {
    resolve: (value: boolean | PromiseLike<boolean>) => void;
}

export function useConfirm() {

    const [promise, setPromise] = React.useState<PromiseHandlers | null>(null)

    const confirm = () => new Promise<boolean>((resolve, _reject) => {
        setPromise({ resolve })
    })

    const handleConfirm = () => {
        promise?.resolve(true)
        setPromise(null)
    }

    const handleCancel = () => {
        promise?.resolve(false)
        setPromise(null)
    }

    return { confirm, handleConfirm, handleCancel }
}