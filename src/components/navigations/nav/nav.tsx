"use client"
import React from 'react';
import { SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { NavActions, NavBase, NavLogo } from "../../ui/nav";
import { cn } from '@/lib/utils';

type Selection = {
    id: number;
    label: string;
}

const selections: Selection[] = [
    {
        id: 1,
        label: "Customers",
    },
    {
        id: 2,
        label: "Shop",
    }
]

export default function Navigation() {
    const [selected, setSelected] = React.useState<number>(selections[0].id)
    return (
        <NavBase>
            <NavLogo />
            <div className="flex bg-slate-800 rounded-lg w-72 h-12">
                {selections.map((selection) => (
                    <div 
                    key={selection.id} 
                    className={cn(
                        "flex-1 flex items-center justify-center h-content m-1 rounded-lg cursor-pointer font-bold text-lg",
                        selected === selection.id ? "bg-slate-700" : ""
                    )}
                    onClick={() => setSelected(selection.id)}>
                        {selection.label}
                    </div>
                ))}
            </div>
            <NavActions>
                <Button variant='icon'>
                    <SettingsIcon />
                </Button>
                <Button variant='icon'>
                    <UserIcon />
                </Button>
            </NavActions>
        </NavBase>
    )
}