import { Button } from '@/components/ui/button';

type Props = {
    onCancel: () => void;
    onSave: () => void;
    show: boolean;
}
export default function ActionButtons({ onCancel, onSave, show }: Props) {
    if (show) return (
        <div className='flex justify-end'>
            <div className="flex space-x-2 sm:w-1/2 w-full">
            <Button
                variant='secondary'
                className='flex-1'
                onClick={onCancel}
            >Cancel</Button>
            <Button
                variant='primary'
                className='flex-1'
                onClick={onSave}
            >Save</Button>
            </div>
        </div>
    )
    else return;
}