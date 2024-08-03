"use client"
import React from 'react';
import { NavActions, NavBase, NavLogo } from "../../ui/nav";
import { cn } from '@/lib/utils';
import Profile from './profile';
import Settings from './settings';

export type Context = "Customers" | "Shop"

type Selection = {
    id: number;
    context: Context;
}

const selections: Selection[] = [
    {
        id: 1,
        context: "Customers",
    },
    {
        id: 2,
        context: "Shop",
    }
]

type Props = {
    context: Context;
    setContext: React.Dispatch<React.SetStateAction<Context>>;
}

export default function Navigation({ context, setContext }: Props) {
    return (
        <>
            <NavBase>
                <NavLogo />
                <div className="flex flex-1 bg-slate-800 rounded-lg w-72 h-12">
                    {selections.map((selection) => (
                        <div
                            key={selection.id}
                            className={cn(
                                "flex-1 flex items-center justify-center h-content m-1 rounded-lg cursor-pointer font-bold text-lg",
                                context === selection.context ? "bg-slate-700" : ""
                            )}
                            onClick={() => setContext(selection.context)}>
                            {selection.context}
                        </div>
                    ))}
                </div>
                <NavActions>
                    <Profile />
                    <Settings />
                </NavActions>
            </NavBase>
        </>
    )
}