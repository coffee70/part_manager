'use client'
import { Field, Section, SectionCollection } from "@/types/collections";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { Button } from "../ui/button";
import Attributes from "./attributes";
import { Attribute } from "./attributes";
import Fields from "./fields";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

type Props = {
    sections: Array<Section & {
        fields: Field[];
    }>;
    attributes: Attribute[];
    mode: 'create' | 'update';
    fieldState?: Record<string, any>;
    setFieldState?: (fieldState: Record<string, any>) => void;
    attributeState?: Record<string, any>;
    setAttributeState?: (attributeState: Record<string, any>) => void;
    onSubmit?: (fieldState: Record<string, any>) => void;
    children: React.ReactNode;
}

const collectionNames: Record<SectionCollection, string> = {
    'customerOrders': 'Customer Order',
    'shopOrders': 'Shop Order',
    'parts': 'Part',
    'serials': 'Serial',
    'customers': 'Customer',
}

export default function Form(props: Props) {

    const {
        sections,
        attributes,
        mode,
        fieldState,
        setFieldState,
        attributeState,
        setAttributeState,
        onSubmit,
        children,
    } = props;

    const { collection } = useURLMetadata();
    const collectionName = collectionNames[collection];

    const header = mode === 'create' ? `Create ${collectionName}` : `Update ${collectionName}`;

    const description = mode === 'create' ? `Create a new ${collectionName}` : `Update an existing ${collectionName}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                    <DialogDescription>
                        {/* This is a visually hidden description for screen readers */}
                        <VisuallyHidden.Root>
                            {description}
                        </VisuallyHidden.Root>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="flex flex-col space-y-6">
                    {/* <Attributes
                        attributes={attributes}
                        attributeState={attributeState}
                        setAttributeState={setAttributeState}
                    />
                    <Fields
                        sections={sections}
                        fieldState={fieldState}
                        setFieldState={setFieldState}
                    /> */}
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}