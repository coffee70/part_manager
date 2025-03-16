'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Input } from '@/components/ui/fields/input';
import Select from '@/components/ui/fields/select';
import { StepType, stepTypes } from "@/types/collections";
import { Button } from "../../ui/button";
import { Node } from "./types";
import { useBuilderContext } from "./builder.context";
import React from "react";

type FormState = {
    name: string;
    type: StepType;
}

type Props = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    step?: Node;
    children?: React.ReactNode;
}

export default function StepForm({ step, open, setOpen, children }: Props) {
    const [_open, _setOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : _open;

    React.useEffect(() => {
        if (isControlled) return;
        _setOpen(false);
    }, [isControlled, open]);

    const {
        addNode,
        updateNode,
        resetSelectedItem,
    } = useBuilderContext();

    const initialState = React.useCallback(() => ({
        name: step ? step.name : '',
        type: step ? step.type : 'To-do',
    }), [step]);

    React.useEffect(() => {
        setFormState(initialState)
    }, [step, initialState]);

    const [formState, setFormState] = React.useState<FormState>(initialState);

    React.useEffect(() => {
        // on open make sure no items are selected because
        // if the form is open and the node is selected and the 
        // use presses the delete key it will delete the node
        if (currentOpen) {
            resetSelectedItem();
        }
    }, [currentOpen, resetSelectedItem]);

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            _setOpen(newOpen);
        }
        if (setOpen) {
            setOpen(newOpen);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                ...formState,
            });
        }
        handleOpenChange(false);
        setFormState(initialState);
    };

    const title = step ? `Edit step: ${step.name}` : 'Create a new step';
    const description = step ? `Edit the step ${step.name}` : 'Create a new step for your route';

    return (
        <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
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