import { AlignLeftIcon } from 'lucide-react';

export default function Title() {
    return (
        <div className="flex items-center space-x-4">
            <div className='flex items-center justify-center w-14 h-14 bg-black rounded-md text-white'>
                <AlignLeftIcon strokeWidth={3} size={50} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Fields</h1>
                <h3 className="text-lg text-accent-secondary">Customer Orders</h3>
            </div>
        </div>
    )
}