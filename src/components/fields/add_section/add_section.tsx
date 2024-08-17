import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { PlusIcon } from 'lucide-react';
import ActionButtons from '../action_buttons';

export default function AddSection() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>
                    <div className="flex items-center">
                        <PlusIcon size={20} className='pr-1' />
                        <span className="pr-1">New Section</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className='min-w-96'>
                <DialogHeader>
                    <DialogTitle>New Section</DialogTitle>
                    <DialogDescription>Add a new data section.</DialogDescription>
                </DialogHeader>
                <Input placeholder='Section Name' className='border border-muted-foreground p-1' />
                <DialogFooter>
                    <ActionButtons />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}