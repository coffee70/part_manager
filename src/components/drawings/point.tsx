'use client'
import React from 'react';
import Input from './input';
import {
    useFloating,
    useInteractions,
    useClick,
    useDismiss,
    useRole,
    offset,
    flip,
    shift,
    autoUpdate,
    FloatingFocusManager
} from '@floating-ui/react';
import {
    TRACER_POINT_HEIGHT,
    TRACER_POINT_HOVER_HEIGHT,
    TRACER_POINT_HOVER_WIDTH,
    TRACER_POINT_WIDTH
} from './constants';
import useBuffer from './buffer.hook';
import { useDrawingViewerContext } from './context';

type PointProps = {
    point: { x: number, y: number };
}

export default function Point(props: PointProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [hovered, setHovered] = React.useState<boolean>(false);
    const { buffer } = useBuffer({ hovered: hovered });
    const { refs, floatingStyles, context } = useFloating({
        placement: 'top',
        open: open,
        onOpenChange: setOpen,
        middleware: [offset(buffer), flip(), shift()],
        whileElementsMounted: autoUpdate,
    })

    const click = useClick(context)
    const dismiss = useDismiss(context)
    const role = useRole(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ])

    return (
        <>
            <PointTrigger
                ref={refs.setReference}
                hovered={hovered}
                setHovered={setHovered}
                {...getReferenceProps()}
                {...props} />
            {open && (
                <FloatingFocusManager context={context}>
                    <PointContent
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    />
                </FloatingFocusManager>
            )}
        </>
    )
}

type PointTriggerProps = React.HTMLAttributes<HTMLButtonElement> & {
    point: { x: number, y: number };
    hovered: boolean;
    setHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

const PointTrigger = React.forwardRef<HTMLButtonElement, PointTriggerProps>(function PointTrigger(props, ref) {
    const { point, hovered, setHovered, ...other } = props;
    const { pointer } = useDrawingViewerContext();

    return (
        <button
            ref={ref}
            className='absolute bg-primary rounded-full border-2 border-muted-foreground'
            style={{
                left: point.x - (hovered ? TRACER_POINT_HOVER_WIDTH / 2 : TRACER_POINT_WIDTH / 2),
                top: point.y - (hovered ? TRACER_POINT_HOVER_HEIGHT / 2 : TRACER_POINT_HEIGHT / 2),
                width: hovered ? TRACER_POINT_HOVER_WIDTH : TRACER_POINT_WIDTH,
                height: hovered ? TRACER_POINT_HOVER_HEIGHT : TRACER_POINT_HEIGHT,
                cursor: pointer === 'add' ? 'crosshair' : pointer === 'delete' ? 'default' : 'pointer',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            disabled={pointer === 'add'}
            {...other}
        />
    )
})

type PointContentProps = React.HTMLAttributes<HTMLDivElement>

const PointContent = React.forwardRef<HTMLDivElement, PointContentProps>(function PointContent(props, ref) {

    const [dimension, setDimension] = React.useState<{ name: string, value: number, units: string }>({
        name: '',
        value: 0,
        units: '',
    });

    const handleDimensionChange = (
        property: keyof typeof dimension,
        value: typeof dimension[typeof property]
    ) => {
        setDimension(prev => ({ ...prev, [property]: value }));
    }

    return (
        <div
            ref={ref}
            className='p-2 flex flex-col space-y-2 bg-foreground z-10 border border-border cursor-default'
            {...props}
        >
            <Input label='Name' value={dimension.name} onChange={(e) => handleDimensionChange('name', e.target.value)} />
            <Input label='Value' value={dimension.value} onChange={(e) => handleDimensionChange('value', e.target.valueAsNumber)} />
            <Input label='Units' value={dimension.units} onChange={(e) => handleDimensionChange('units', e.target.value)} />
        </div>
    )
})