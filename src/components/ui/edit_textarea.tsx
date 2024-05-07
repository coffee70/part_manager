'use client'
import React from 'react';
import { ClickAwayListener } from '@mui/base';

type EditableTextareaContextType = {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    ref: React.RefObject<HTMLTextAreaElement>;
}

const EditableTextareaContext = React.createContext<EditableTextareaContextType | null>(null);

export const useEditableTextareaContext = () => {
    const context = React.useContext(EditableTextareaContext);
    if (!context) {
        throw new Error('EditableTextareaContext must be used within an EditableTextareaProvider');
    }
    return context;
}

type EditableTextareaProviderProps = {
    children: React.ReactNode;
}

const EditableTextareaProvider = ({ children }: EditableTextareaProviderProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const ref = React.useRef<HTMLTextAreaElement>(null)
    return (
        <EditableTextareaContext.Provider value={{ isEditing, setIsEditing, ref }}>
            {children}
        </EditableTextareaContext.Provider>
    );
}

type EditableTextareaProps = {
    children: React.ReactNode;
}

export const EditableTextarea = ({ children }: EditableTextareaProps) => {
    return (
        <EditableTextareaProvider>
            {children}
        </EditableTextareaProvider>
    );
}

type EditableTextareaTriggerProps = {
    children: React.ReactNode;
}

export const EditableTextareaTrigger = ({ children }: EditableTextareaTriggerProps) => {
    const { isEditing } = useEditableTextareaContext();
    if (isEditing) return;
    return children;
}

type EditableTextareaContentProps = {
    children: React.ReactElement;
}

export const EditableTextareaContent = ({ children }: EditableTextareaContentProps) => {
    const { isEditing, setIsEditing, ref } = useEditableTextareaContext();

    React.useEffect(() => {
        /**
         * Focus the textarea when editing at
         * the end of the value
         */
        if (isEditing && ref.current) {
            const length = ref.current.value.length;
            ref.current.focus();
            ref.current.setSelectionRange(length, length);
        }
    }, [isEditing, ref]);

    if (!isEditing) return;

    return (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            {React.cloneElement(children, { ref })}
        </ClickAwayListener>
    )

}