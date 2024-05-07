'use client'
import React from 'react';
import { ClickAwayListener } from '@mui/base';

type EditableInputContextType = {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    ref: React.RefObject<HTMLInputElement>;
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
    const ref = React.useRef<HTMLInputElement>(null)
    return (
        <EditableInputContext.Provider value={{ isEditing, setIsEditing, ref }}>
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
    const { isEditing } = useEditableInputContext();
    if (isEditing) return;
    return children;
}

type EditableInputContentProps = {
    children: React.ReactElement;
}

export const EditableInputContent = ({ children }: EditableInputContentProps) => {
    const { isEditing, setIsEditing, ref } = useEditableInputContext();

    React.useEffect(() => {
        if (isEditing && ref.current) {
            ref.current.focus();
        }
    }, [isEditing, ref]);

    if (!isEditing) return;

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            {React.cloneElement(children, { ref })}
        </ClickAwayListener>
    )

}