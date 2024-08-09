'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
    className?: string;
}

export default function Title({ value, className }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    return (
        <div className={cn("group flex border border-transparent pl-1 hover:border-foreground", isEditing ? "border-foreground" : "")}>
            <Input
                className={className}
                placeholder="Section Name"
                value={value}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
            />
            {!isEditing && <Button variant='icon' className="bg-foreground p-1 invisible group-hover:visible">
                <PencilIcon />
            </Button>}
            {isEditing && <Button variant='icon' className="bg-foreground p-1">
                <CheckIcon />
            </Button>}
        </div>
    )
}