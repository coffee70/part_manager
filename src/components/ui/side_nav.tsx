'use client'
import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon, CircleIcon } from "lucide-react";
import Link from 'next/link';

type NavBaseProps = {
    children: React.ReactNode
    className?: string
}

function NavBase({ children, className }: NavBaseProps) {
    return (
        <div className={cn('flex flex-col items-center bg-foreground h-full w-64', className)}>
            {children}
        </div>
    )
}

type NavHeaderProps = {
    children: React.ReactNode
}

function NavHeader({ children }: NavHeaderProps) {
    return (
        <div className="w-full px-4 pt-4 pb-2">
            {children}
        </div>
    )
}

type NavContentProps = {
    children: React.ReactNode
}

function NavContent({ children }: NavContentProps) {
    return (
        <div className="flex flex-col w-full">
            {children}
        </div>
    )
}

type NavFooterProps = {
    children: React.ReactNode
}

function NavFooter({ children }: NavFooterProps) {
    return (
        <div className="flex flex-col space-y-1 mb-2 mt-1 w-full">
            {children}
        </div>
    )
}

type NavItemProps = {
    label: string
    href: string
    icon?: React.ReactNode
    open?: boolean
}

function NavItem({ label, icon, open, href }: NavItemProps) {
    return (
        <Link href={href} className='flex items-center h-12 px-4 my-1 hover:bg-hover'>
            <div className='flex items-center space-x-6'>
                {icon}
                <span>{label}</span>
            </div>
            {open === true && <ChevronUpIcon className='ml-auto' />}
            {open === false && <ChevronDownIcon className='ml-auto' />}
        </Link>
    )
}

type ModelItemProps = {
    label: string
    href: string
    color: string
}

export function ModelItem({ label, href, color }: ModelItemProps) {
    return (
        <Link href={href} className='group flex items-center h-12 px-4 my-1 hover:bg-hover'>
            <div className='flex items-center space-x-6'>
                <div className='flex items-center w-8 h-8'>
                    <div className="w-6 h-6 rounded-full ring-offset-2 ring-offset-foreground group-hover:ring-2"
                        style={{
                            backgroundColor: color,
                            '--tw-ring-color': color,
                        } as React.CSSProperties}
                    />
                </div>
                <span>{label}</span>
            </div>
        </Link>
    )
}

type SubNavItemProps = {
    label: string
    href: string
    top?: boolean
    bottom?: boolean
}

function SubNavItem({ label, top, bottom, href }: SubNavItemProps) {
    return (
        <Link href={href} className="flex items-center space-x-6 h-10 px-4 text-accent-secondary hover:bg-hover">
            <div className="flex flex-col items-center h-full w-6">
                <div className={cn("grow border", top ? "border-transparent" : "border-accent-foreground")} />
                <CircleIcon size={8} strokeWidth={3} />
                <div className={cn("grow border", bottom ? "border-transparent" : "border-accent-foreground")} />
            </div>
            <span>{label}</span>
        </Link>
    )
}

type SubNavProps = {
    label: string
    icon?: React.ReactNode
    children: React.ReactNode
}

function SubNav({ label, icon, children }: SubNavProps) {
    const [open, setOpen] = React.useState(false)
    return (
        <div className="flex flex-col w-full">
            <SubNavTrigger label={label} icon={icon} open={open} setOpen={setOpen} />
            <SubNavContent open={open}>
                {children}
            </SubNavContent>
        </div>
    )
}

type SubNavTriggerProps = {
    label: string
    icon?: React.ReactNode
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function SubNavTrigger({ label, icon, open, setOpen }: SubNavTriggerProps) {
    return (
        <button className='flex items-center h-12 px-4 my-1 hover:bg-hover' onClick={() => setOpen(prev => !prev)}>
            <div className='flex items-center space-x-6'>
                {icon}
                <span>{label}</span>
            </div>
            {open === true && <ChevronUpIcon className='ml-auto' />}
            {open === false && <ChevronDownIcon className='ml-auto' />}
        </button>
    )
}

type SubNavContentProps = {
    children: React.ReactNode
    open?: boolean
}

function SubNavContent({ children, open }: SubNavContentProps) {
    if (!open) return null
    return (
        <div className="flex flex-col w-full">
            {children}
        </div>
    )
}

type NavDividerProps = {
    bottom?: boolean
}

function NavDivider({ bottom }: NavDividerProps) {
    return (
        <div className={cn("flex items-center w-full px-4 py-2", { "mt-auto": bottom })}>
            <div className="grow border-t border-hover" />
        </div>
    )
}

export {
    NavBase,
    NavHeader,
    NavContent,
    NavFooter,
    NavItem,
    SubNav,
    SubNavItem,
    NavDivider,
}