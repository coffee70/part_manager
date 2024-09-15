'use client'
import React from 'react';
import FieldBase, { FieldRefs } from "./base"
import { DateInput } from '@/components/ui/date_input';

export default function DateField() {
    const [date, setDate] = React.useState('');
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const formRef = React.useRef<HTMLFormElement>(null);
    const fieldRefs = React.useRef<FieldRefs>(null);

    return (
        <form ref={formRef}>
            <FieldBase
                formRef={formRef}
                fieldRefs={fieldRefs}
                error={error}
                errorMessage={errorMessage}
            >
                <DateInput
                    ref={fieldRefs}
                    setDate={setDate}
                    setError={setError}
                    setErrorMessage={setErrorMessage}
                />
            </FieldBase>
        </form>
    )
}