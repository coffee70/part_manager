import { Button } from './button'
import { MoreHorizontalIcon } from 'lucide-react'

export default function More() {
    return (
        <div className='flex items-center justify-center'>
            <Button variant="icon">
                <MoreHorizontalIcon />
            </Button>
        </div>
    )
}