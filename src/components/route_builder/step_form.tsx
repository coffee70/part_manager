'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Input } from '@/components/ui/fields/input';
import Select from '@/components/ui/fields/select';
import { StepType, stepTypes } from "@/types/collections";
import { Button } from "../ui/button";
import { Node } from "./types";
import { useBuilderContext } from "./builder.context";
import React from "react";

type FormState = {
    name: string;
    type: StepType;
}

type Props = {
    step?: Node;
    children: React.ReactNode;
}

export default function StepForm({ step, children }: Props) {
    const [open, setOpen] = React.useState(false);
    const { addNode, updateNode } = useBuilderContext();

    const [formState, setFormState] = React.useState<FormState>({
        name: step ? step.name : '',
        type: step ? step.type : 'To-do',
    });

    const onSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step) {
            updateNode({
                ...step,
                ...formState,
            });
        } else {
            addNode({
                id: crypto.randomUUID(),
                x: 0,
                y: 0,
                edges: [],
                ...formState,
            });
        }
        setOpen(false);
        setFormState({
            name: '',
            type: 'To-do',
        });
    }, [formState, step, addNode, updateNode]);

    const title = step ? `Edit step: ${step.name}` : 'Create a new step';
    const description = step ? `Edit the step ${step.name}` : 'Create a new step for your route';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[560px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <VisuallyHidden.Root>
                            {description}
                        </VisuallyHidden.Root>
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="space-y-6"
                    onSubmit={onSubmit}
                >
                    <div className='overflow-y-auto space-y-1'>
                        <Input
                            id='name'
                            label='Name'
                            description='The name of the step'
                            type='text'
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                        <Select
                            id='type'
                            label='Type'
                            description='The type of step'
                            options={[...stepTypes]}
                            value={formState.type}
                            onChange={(v) => setFormState({ ...formState, type: v as StepType })}
                        />
                    </div>
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}