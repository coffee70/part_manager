'use client'
import { cn } from '@/lib/utils';
import React from 'react';

type Meridiem = 'AM' | 'PM'

type Input = 'hours' | 'minutes' | 'seconds' | 'meridiem'

type Time = {
    hours: string;
    minutes: string;
    seconds: string;
    meridiem: Meridiem
}

type UseTimeInputProps = {
    setTime: (time: string) => void
}

export function useTimeInput({ setTime }: UseTimeInputProps) {
    const [time, _setTime] = React.useState<Time>({ hours: '--', minutes: '--', seconds: '--', meridiem: 'AM' });

    const hoursRef = React.useRef<HTMLInputElement>(null);
    const minutesRef = React.useRef<HTMLInputElement>(null);
    const secondsRef = React.useRef<HTMLInputElement>(null);
    const meridiemRef = React.useRef<HTMLInputElement>(null);

    // any time time updates, sync it with the input using setTime
    React.useEffect(() => {
        setTime(time.hours + ':' + time.minutes + ':' + time.seconds + ' ' + time.meridiem)
    }, [time])

    const getPrevRef = (input: Input) => {
        switch (input) {
            case 'hours':
                return undefined;
            case 'minutes':
                return hoursRef;
            case 'seconds':
                return minutesRef;
            case 'meridiem':
                return secondsRef;
        }
    }

    const getNextRef = (input: Input) => {
        switch (input) {
            case 'hours':
                return minutesRef;
            case 'minutes':
                return secondsRef;
            case 'seconds':
                return meridiemRef;
            case 'meridiem':
                return undefined;
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, input: Input) => {
        const key = e.key;

        // count the number of dashes in time[input]
        const dashCount = time[input].split('-').length - 1;

        // case when key is a number
        if (/[0-9]/.test(key)) {
            if (dashCount === 0) {
                _setTime(prev => ({ ...prev, [input]: '-' + key }));
            }
            if (dashCount === 1) {
                _setTime(prev => ({ ...prev, [input]: prev[input][1] + key }));
                const nextRef = getNextRef(input);
                nextRef?.current?.focus();
            }
            if (dashCount === 2) {
                _setTime(prev => ({ ...prev, [input]: '-' + key }));
            }
        }

        // case when key is Backspace
        if (key === 'Backspace') {
            if (dashCount === 0) {
                _setTime(prev => ({ ...prev, [input]: '-' + prev[input][1] }));
            }
            if (dashCount === 1) {
                _setTime(prev => ({ ...prev, [input]: '--' }));
            }
            if (dashCount === 2) {
                const prevRef = getPrevRef(input);
                prevRef?.current?.focus();
            }
        }

        // case when key is tab
        if (key === 'Tab') {
            e.preventDefault()
            const nextRef = getNextRef(input);
            nextRef?.current?.focus();
        }
    }

    const handleKeyDownMeridiem = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;

        if (key === 'a' || key === 'A') {
            _setTime(prev => ({ ...prev, meridiem: 'AM' }));
        }

        if (key === 'p' || key === 'P') {
            _setTime(prev => ({ ...prev, meridiem: 'PM' }));
        }

        if (key === 'Backspace') {
            const prevRef = getPrevRef('meridiem');
            prevRef?.current?.focus();
        }
    }

    const invalidTime = React.useMemo(() => {
        // if any fields contain dashes return false since
        // the user is still inputting values
        if (time.hours.includes('-') || time.minutes.includes('-') || time.seconds.includes('-')) {
            return false
        }

        // check the hours field is between 1 and 12
        if (time.hours < '01' || time.hours > '12') {
            return true
        }

        // check the minutes field is between 0 and 59
        if (time.minutes < '00' || time.minutes > '59') {
            return true
        }

        // check the seconds field is between 0 and 59
        if (time.seconds < '00' || time.seconds > '59') {
            return true
        }

        // check the meridiem field is AM or PM
        if (time.meridiem !== 'AM' && time.meridiem !== 'PM') {
            return true
        }

        return false
    }, [time])

    return {
        time, 
        hoursRef,
        minutesRef,
        secondsRef,
        meridiemRef,
        invalidTime,
        handleKeyDown,
        handleKeyDownMeridiem
    }
}

type TimeInputProps = {
    time: Time,
    hoursRef: React.RefObject<HTMLInputElement>,
    minutesRef: React.RefObject<HTMLInputElement>,
    secondsRef: React.RefObject<HTMLInputElement>,
    meridiemRef: React.RefObject<HTMLInputElement>,
    invalidTime: boolean,
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, input: Input) => void,
    handleKeyDownMeridiem: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const TimeInput = (props: TimeInputProps) => {
    const {
        time,
        hoursRef,
        minutesRef,
        secondsRef,
        meridiemRef,
        invalidTime,
        handleKeyDown,
        handleKeyDownMeridiem
    } = props

    return (
        <div className='flex space-x-0.5'>
            <input
                ref={hoursRef}
                className={cn(
                    'w-6 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidTime ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={time.hours}
                onKeyDown={(e) => handleKeyDown(e, 'hours')}
                readOnly
            />
            <span className="text-muted-foreground">:</span>
            <input
                ref={minutesRef}
                className={cn(
                    'w-6 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidTime ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={time.minutes}
                onKeyDown={(e) => handleKeyDown(e, 'minutes')}
                readOnly
            />
            <span className="text-muted-foreground">:</span>
            <input
                ref={secondsRef}
                className={cn(
                    'w-6 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidTime ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={time.seconds}
                onKeyDown={(e) => handleKeyDown(e, 'seconds')}
                readOnly
            />
            <input
                ref={meridiemRef}
                className={cn(
                    'w-8 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidTime ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={time.meridiem}
                onKeyDown={(e) => handleKeyDownMeridiem(e)}
                readOnly
            />
        </div>
    )
}
