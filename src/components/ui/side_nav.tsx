'use client'
import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronsUpIcon, ChevronUpIcon, CircleIcon } from "lucide-react";
import { Jost } from "next/font/google"
import { Badge } from './badge';

const jost = Jost({
    subsets: ["latin"],
    weight: ["700"],
})

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

function NavLogo() {
    return (
        <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-black rounded-md text-white'>
                <ChevronsUpIcon strokeWidth={3} size={32} />
            </div>
            <span className={cn(jost.className, 'text-4xl')}>Aentx.</span>
            <Badge label="BETA" color='black' className='px-2'/>
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
    icon?: React.ReactNode
    open?: boolean
}

function NavItem({ label, icon, open }: NavItemProps) {
    return (
        <button className='flex items-center h-12 px-4 my-1 hover:bg-hover'>
            <div className='flex items-center space-x-6'>
                {icon}
                <span>{label}</span>
            </div>
            {open === true && <ChevronUpIcon className='ml-auto' />}
            {open === false && <ChevronDownIcon className='ml-auto' />}
        </button>
    )
}

type SubNavItemProps = {
    label: string
    top?: boolean
    bottom?: boolean
}

function SubNavItem({ label, top, bottom }: SubNavItemProps) {
    return (
        <button className="flex items-center space-x-6 h-10 px-4 text-accent-secondary hover:bg-hover">
            <div className="flex flex-col items-center h-full w-6">
                <div className={cn("grow border", top ? "border-transparent" : "border-accent-foreground")} />
                <CircleIcon size={8} strokeWidth={3} />
                <div className={cn("grow border", bottom ? "border-transparent" : "border-accent-foreground")} />
            </div>
            <span>{label}</span>
        </button>
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
    NavLogo,
    NavContent,
    NavFooter,
    NavItem,
    SubNav,
    SubNavItem,
    NavDivider,
}