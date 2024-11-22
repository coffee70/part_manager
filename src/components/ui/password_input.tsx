'use client'
import React from "react";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    containerClassName: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, Props>(({ containerClassName, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
        <div className={cn('flex', containerClassName)}>
            <Input
                ref={ref}
                type={show ? 'text' : 'password'}
                {...props}
            />
            {show ? (
                <button type='button' onClick={() => setShow(false)}>
                    <EyeOffIcon />
                </button>
            ) : (
                <button type='button' onClick={() => setShow(true)}>
                    <EyeIcon />
                </button>
            )}
        </div>
    )
}) 

PasswordInput.displayName = 'PasswordInput';