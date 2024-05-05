'use client'
import React from 'react';
import { ClickAwayListener } from '@mui/base';

type EditableInputContextType = {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const EditableInputContext = React.createContext<EditableInputContextType | null>(null);

export const useEditableInputContext = () => {
    const context = React.useContext(EditableInputContext);
    if (!context) {
        throw new Error('EditableInputContext must be used within an EditableInputProvider');
    }
    return context;
}

type EditableInputProviderProps = {
    children: React.ReactNode;
}

const EditableInputProvider = ({ children }: EditableInputProviderProps) => {
    const [isEditing, setIsEditing] = React.useState(false);

    return (
        <EditableInputContext.Provider value={{ isEditing, setIsEditing }}>
            {children}
        </EditableInputContext.Provider>
    );
}

type EditableInputProps = {
    children: React.ReactNode;
}

export const EditableInput = ({ children }: EditableInputProps) => {
    return (
        <EditableInputProvider>
            {children}
        </EditableInputProvider>
    );
}

type EditableInputTriggerProps = {
    children: React.ReactNode;
}

export const EditableInputTrigger = ({ children }: EditableInputTriggerProps) => {
    const { isEditing, setIsEditing } = useEditableInputContext();
    if (isEditing) return;
    return (
        <div onClick={() => setIsEditing(true)}>
            {children}
        </div>
    )
}

type EditableInputContentProps = {
    children: React.ReactElement;
}

export const EditableInputContent = ({ children }: EditableInputContentProps) => {
    const { isEditing, setIsEditing } = useEditableInputContext();
    const ref = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    React.useEffect(() => {
        /**
         * Focus the input/textarea when editing at
         * the end of the value
         */
        if (isEditing && ref.current) {
            const length = ref.current.value.length;
            ref.current.focus();
            ref.current.setSelectionRange(length, length);
        }
    }, [isEditing]);

    if (!isEditing) return;

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            {React.cloneElement(children, { ref: ref })}
        </ClickAwayListener>
    )

}