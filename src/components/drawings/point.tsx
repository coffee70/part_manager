'use client'
import React from 'react';
import Input from './input';
import { useFloating, useInteractions, useClick, useDismiss, useRole, offset, flip, shift, autoUpdate, FloatingFocusManager } from '@floating-ui/react';
import { BUFFER, TRACER_POINT_HEIGHT, TRACER_POINT_HOVER_HEIGHT, TRACER_POINT_HOVER_WIDTH, TRACER_POINT_WIDTH } from './constants';
import useBuffer from './buffer.hook';

type PointProps = {
    point: { x: number, y: number };
    index: number;
}

export default function Point(props: PointProps) {
    const { index } = props;
    const [open, setOpen] = React.useState<boolean>(false);
    const [hoveredPointIndex, setHoveredPointIndex] = React.useState<number | null>(null);
    const { buffer } = useBuffer({ hovered: hoveredPointIndex === index });
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
                hoveredPointIndex={hoveredPointIndex}
                setHoveredPointIndex={setHoveredPointIndex}
                {...getReferenceProps()}
                {...props} />
            {open && (
                <FloatingFocusManager
                    context={context}
                    modal={false}
                >
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
    hoveredPointIndex: number | null;
    setHoveredPointIndex: React.Dispatch<React.SetStateAction<number | null>>;
    point: { x: number, y: number };
    index: number;
}

const PointTrigger = React.forwardRef<HTMLButtonElement, PointTriggerProps>(function PointTrigger(props, ref) {
    const { point, index, hoveredPointIndex, setHoveredPointIndex, ...other } = props;

    const handleMouseEnter = (index: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setHoveredPointIndex(index);
    }

    const handleMouseLeave = () => {
        setHoveredPointIndex(null);
    }

    return (
        <button
            ref={ref}
            key={index}
            className='absolute bg-primary rounded-full border-2 border-muted-foreground'
            style={{
                left: point.x - (hoveredPointIndex === index ? TRACER_POINT_HOVER_WIDTH / 2 : TRACER_POINT_WIDTH / 2),
                top: point.y - (hoveredPointIndex === index ? TRACER_POINT_HOVER_HEIGHT / 2 : TRACER_POINT_HEIGHT / 2),
                width: hoveredPointIndex === index ? TRACER_POINT_HOVER_WIDTH : TRACER_POINT_WIDTH,
                height: hoveredPointIndex === index ? TRACER_POINT_HOVER_HEIGHT : TRACER_POINT_HEIGHT,
            }}
            onMouseEnter={handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
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
            className='p-2 flex flex-col space-y-1 bg-foreground z-10 border border-border'
            {...props}
        >
            <Input label='Name' value={dimension.name} onChange={(e) => handleDimensionChange('name', e.target.value)} />
            <Input label='Value' value={dimension.value} onChange={(e) => handleDimensionChange('value', e.target.valueAsNumber)} />
            <Input label='Units' value={dimension.units} onChange={(e) => handleDimensionChange('units', e.target.value)} />
        </div>
    )
})