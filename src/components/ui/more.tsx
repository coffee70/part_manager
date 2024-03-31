import { Button } from './button'
import { MoreHorizontalIcon } from 'lucide-react'

type Props = {
    variant?: 'default' | 'small';
}

export default function More({ variant }: Props) {
    const size = !variant || variant === 'default' ? 'sm' : 'sm_icon'
    return (
        <Button variant="table" size={size}>
            <MoreHorizontalIcon />
        </Button>
    )
}