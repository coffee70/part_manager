import * as React from 'react';
import { InputProps } from '@/components/ui/input';
import Focused from './focused_editable_input';
import NotFocused from './not_focused_editable_input';

export default function EditableInput(props: InputProps) {

    const [hovered, setHovered] = React.useState<boolean>(false);
    const [focused, setFocused] = React.useState<boolean>(false);

    return (
        <>
            {focused && <Focused {...props} setFocused={setFocused} />}
            {!focused && <NotFocused hovered={hovered} setHovered={setHovered} setFocused={setFocused} value={props.value} />}
        </>
    )
}