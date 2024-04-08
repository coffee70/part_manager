import { Button } from '@/components/ui/button';

type Props = {
    onCancel: () => void;
    onSave: () => void;
}
export default function ActionButtons({ onCancel, onSave }: Props) {
    return (
        <div className='flex justify-end'>
            <div className="flex space-x-2 sm:w-1/2 w-full">
            <Button
                variant='secondary'
                className='flex-1'
                onClick={onCancel}
            >Cancel</Button>
            <Button
                className='flex-1'
                onClick={onSave}
            >Save</Button>
            </div>
        </div>
    );
}