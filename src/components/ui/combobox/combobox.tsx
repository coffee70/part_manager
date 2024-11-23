'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    offset,
    shift,
    size,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole
} from '@floating-ui/react';
import { Input } from '../input';
import { ComboboxBadge } from '../badge';
import { ClickAwayListener } from '@mui/base';

type ItemProps = {
    active: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Item = React.forwardRef<
    HTMLDivElement,
    ItemProps
>(({ active, children, className, ...others }, ref) => {
    const id = React.useId();
    return (
        <div
            ref={ref}
            id={id}
            role="option"
            aria-selected={active}
            className={cn(active && 'bg-accent', className)}
            {...others}
        >
            {children}
        </div>

    )
})

Item.displayName = 'Item';

type ComboboxProps = {
    options: string[];
    creative?: boolean;
    multiple?: boolean;
    value?: string | string[];
    onChange?: (value?: string | string[]) => void;
}

export const Combobox = React.forwardRef<HTMLInputElement | null, ComboboxProps>((props, ref) => {

    const {
        options,
        multiple,
        creative,
        value,
        onChange: _onChange,
    } = props;

    const initalValue = () => {
        if (value && !Array.isArray(value)) {
            return value
        }
        else return ""
    }

    const [input, setInput] = React.useState(initalValue);

    // floating logic
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const listRef = React.useRef<Array<HTMLElement | null>>([]);

    const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
        whileElementsMounted: autoUpdate,
        open,
        onOpenChange: setOpen,
        middleware: [
            offset(10),
            flip(),
            shift(),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight}px`
                    });
                },
                padding: 10
            }),
        ]
    });

    const [floatingWidth, setFloatingWidth] = React.useState<number>();

    const setPositionRef = React.useCallback((el: HTMLElement | null) => {
        refs.setPositionReference(el)
        setFloatingWidth(el?.offsetWidth)
    }, [refs])

    const role = useRole(context, { role: 'listbox' });
    const dismiss = useDismiss(context);
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
    })

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps
    } = useInteractions([role, dismiss, listNav]);


    // forward ref logic
    React.useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => refs.domReference.current);


    // select logic
    const filteredOptions = !input ? options : options.filter((option) =>
        option.toLowerCase().startsWith(input.toLowerCase())
    );

    const onSelect = (selected: string) => {
        if (multiple) {
            if (Array.isArray(value)) {
                if (value.includes(selected)) {
                    _onChange && _onChange(value.filter((v) => v !== selected))
                }
                else if (creative || options.some((option) => option === selected)) {
                    _onChange && _onChange([...value, selected])
                }
                setInput("")
            }
            else if (value === undefined) {
                _onChange && _onChange([selected])
                setInput("")
            }
        }
        else if (!multiple) {
            if (creative || options.some((option) => option === selected)) {
                setInput(selected)
                _onChange && _onChange(selected)
            }
            setOpen(false)
        }
        refs.domReference.current?.focus()
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && multiple && Array.isArray(value) && value.length > 0 && input === "") {
            _onChange && _onChange(value.slice(0, value.length - 1))
        }

        if (e.key === "Enter") {
            e.preventDefault()
            if (activeIndex !== null && filteredOptions[activeIndex]) {
                onSelect(filteredOptions[activeIndex])
                setActiveIndex(null)
            }
            else if (creative) {
                onSelect(input)
            }
        }
    }

    const onRemove = (v: string) => {
        if (multiple && Array.isArray(value)) {
            _onChange && _onChange(value.filter((value) => value !== v))
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        setOpen(true);
        setActiveIndex(0);

        // if input changes and in creative mode but not in multiple push inputValue to value
        if (creative && !multiple) {
            _onChange && _onChange(inputValue)
        }

        // if the input is empty and not in creative or multiple mode push undefined to value
        if (!creative && !multiple && inputValue === "") {
            _onChange && _onChange(undefined)
        }
    }

    const onClick = () => {
        setOpen(true);
        setActiveIndex(0);
    }

    const onClickAway = () => {
        if (!creative) {
            if (!multiple && !Array.isArray(value)) {
                // change the value if the input is in the options
                if (options.includes(input)) {
                    setInput(input)
                    _onChange && _onChange(input)
                }
                // reset the input if the value is not in the options and value is not undefined
                else if (value) {
                    setInput(value)
                }
                // reset the input if the value is undefined
                else {
                    setInput("")
                }
            } else if (multiple && Array.isArray(value)) {
                // append the input to the value if the input is in the options and not in the value and reset the input
                if (options.includes(input) && !value.includes(input)) {
                    _onChange && _onChange([...value, input])
                    setInput("")
                }
                // if the options does not include the input reset the input
                // if the value already includes the input reset the input
                else {
                    setInput("")
                }
            }
        }
        else {
            // set the value to a nonempty input
            if (!multiple && !Array.isArray(value) && input !== "") {
                _onChange && _onChange(input)
            }
            // set the value to an empty input
            else if (!multiple && !Array.isArray(value) && input === "") {
                _onChange && _onChange(undefined)
            }
            // append the input to the value if the input is nonempty and reset the input
            else if (multiple && Array.isArray(value) && input !== "") {
                _onChange && _onChange([...value, input])
                setInput("")
            }
        }
    }

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <div>
                <div ref={setPositionRef} className='w-full inline-flex items-center flex-wrap'>
                    {multiple && Array.isArray(value) && value.length > 0 && value.map((v) => (
                        <ComboboxBadge key={v} label={v} onRemove={() => onRemove(v)} />
                    ))}
                    <Input
                        {...getReferenceProps({
                            className: "px-1",
                            ref: refs.setReference,
                            value: input,
                            onChange,
                            onKeyDown,
                            onClick,
                            "aria-autocomplete": "list",
                        })}
                    />
                </div>
                {open && (
                    <FloatingFocusManager
                        context={context}
                        initialFocus={-1}
                        visuallyHiddenDismiss
                    >
                        <div
                            {...getFloatingProps({
                                className: 'bg-white border border-foreground shadow-md overflow-y-auto p-1 space-y-1 z-10',
                                ref: refs.setFloating,
                                style: {
                                    ...floatingStyles,
                                    width: floatingWidth
                                }
                            })}
                        >
                            {filteredOptions.length > 0 && filteredOptions.map((option, index) => (
                                <Item
                                    className='flex items-center p-1'
                                    key={option}
                                    active={activeIndex === index}
                                    {...getItemProps({
                                        onClick: () => onSelect(option),
                                        ref(node) {
                                            listRef.current[index] = node;
                                        }
                                    })}
                                >
                                    {option}
                                </Item>
                            ))}
                            {filteredOptions.length === 0 && (
                                <div className='p-1 text-sm'>No options found.</div>
                            )}
                        </div>
                    </FloatingFocusManager>
                )}
            </div>
        </ClickAwayListener>
    )
})

Combobox.displayName = 'Combobox';