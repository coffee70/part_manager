'use client'
import React from 'react'
import { Button } from "@/components/ui/button";
import { SquareIcon, PauseIcon, AlarmClockPlusIcon, ChevronRightIcon, ChevronLeftIcon, PlayIcon } from "lucide-react";

type Props = {
    endTime: Date
}

export default function Timer({ endTime }: Props) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [tick, setTick] = React.useState<boolean>(false);
    const [paused, setPaused] = React.useState<boolean>(false);
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        return difference > 0 ? difference : 0;
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!(tick && paused)) return;
            setTimeLeft(prevTimeLeft => {
                return prevTimeLeft - 1000 > 0 ? prevTimeLeft - 1000 : 0;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [tick, paused]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, '0');

    return (
        <>
            {tick && <div className="flex items-center bg-red-600 h-10 rounded-sm text-white">
                <span className='font-bold px-2'>{hours}:{minutes}:{seconds}</span>
                {open && <>
                    <div className='border-l border-white h-full'></div>
                    <div className="flex items-center space-x-2 bg-red-800 h-full px-2">
                        <Button variant='icon'>
                            <SquareIcon strokeWidth={1} onClick={() => setTick(false)}/>
                        </Button>
                        <Button variant='icon'>
                            <PauseIcon strokeWidth={1} onClick={() => setPaused(prev => !prev)}/>
                        </Button>
                        <Button variant='icon'>
                            <AlarmClockPlusIcon strokeWidth={1} />
                        </Button>
                    </div>
                </>}
                <div className='border-l border-white h-full' />
                <Button variant='icon' onClick={() => setOpen(prev => !prev)}>
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </Button>
            </div>}
            {!tick && <div className='flex items-center bg-green-600 h-10 rounded-sm text-white'>
                <span className='font-bold px-2'>{hours}:{minutes}:{seconds}</span>
                <div className='border-l border-white h-full' />
                <Button variant='icon' onClick={() => setTick(true)}>
                    <PlayIcon />
                </Button>
            </div>}
        </>
    )
}