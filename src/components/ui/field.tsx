'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string
}

export default function Title(props: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    return (
        <div className={cn("group flex border border-transparent pl-1 hover:border-foreground", isEditing ? "border-foreground" : "")}>
            <Input
                {...props}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
            />
            {!isEditing && <Button variant='icon' className="bg-foreground p-1 rounded-none invisible group-hover:visible">
                <PencilIcon />
            </Button>}
            {isEditing && <Button variant='icon' className="bg-foreground p-1 rounded-none">
                <CheckIcon />
            </Button>}
        </div>
    )
}