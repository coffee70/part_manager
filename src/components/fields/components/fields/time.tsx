'use client'
import React from 'react';
import FieldBase, { FieldRefs } from "./base"
import { TimeInput } from '@/components/ui/time_input';

type TimeFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function TimeField(props: TimeFieldProps) {
    const [time, setTime] = React.useState('');
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
                <TimeInput
                    ref={fieldRefs}
                    setTime={setTime}
                    setError={setError}
                    setErrorMessage={setErrorMessage}
                />
            </FieldBase>
        </form>
    )
}