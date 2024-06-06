import React from 'react';
import { Input as BaseInput } from '../ui/input';

type InputProps = {
    label: string;
    value: React.InputHTMLAttributes<HTMLInputElement>['value'];
    onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
}

export default function Input({ label, value, onChange, type = 'text' }: InputProps) {
    return (
        <div className='flex items-center space-x-4 justify-between'>
            <div>{`${label}:`}</div>
            <div>
                <BaseInput type={type} value={value} onChange={onChange} />
            </div>
        </div>
    )
}