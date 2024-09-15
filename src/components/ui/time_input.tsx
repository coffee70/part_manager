'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { FieldRefs } from '../fields/components/fields/base';

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
    }, [time, setTime])

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
                handleFocus(getNextRef(input))
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
                handleFocus(getPrevRef(input))
            }
        }

        // case when key is tab
        if (key === 'Tab') {
            e.preventDefault()
            handleFocus(getNextRef(input))
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
            handleFocus(secondsRef)
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


    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // handles focus logic for when input is clicked on
        switch (e.target) {
            case hoursRef.current:
                handleFocus(hoursRef);
                return;
            case minutesRef.current:
                handleFocus(minutesRef);
                return;
            case secondsRef.current:
                handleFocus(secondsRef);
                return;
            case meridiemRef.current:
                handleFocus(meridiemRef);
                return;
        }

        // handles focus logic for when white space is clicked on
        if (time.hours === '--') {
            handleFocus(hoursRef);
        }
        else if (time.minutes === '--') {
            handleFocus(minutesRef);
        }
        else if (time.seconds === '--') {
            handleFocus(secondsRef);
        }
        else {
            handleFocus(meridiemRef);
        }
    }

    const handleFocus = (ref: React.RefObject<HTMLInputElement> | undefined) => {
        ref?.current?.focus();
    }

    return {
        time,
        hoursRef,
        minutesRef,
        secondsRef,
        meridiemRef,
        invalidTime,
        handleKeyDown,
        handleKeyDownMeridiem,
        handleClick,
    }
}

type TimeInputProps = {
    setTime: (time: string) => void;
    setError?: (error: boolean) => void;
    setErrorMessage?: (message: string) => void;
}

export const TimeInput = React.forwardRef<FieldRefs, TimeInputProps>((props, ref) => {

    const {
        setTime,
        setError,
        setErrorMessage,
    } = props;

    const {
        time,
        hoursRef,
        minutesRef,
        secondsRef,
        meridiemRef,
        invalidTime,
        handleKeyDown,
        handleKeyDownMeridiem,
        handleClick,
    } = useTimeInput({ setTime });

    React.useImperativeHandle(ref, () => ({ 
        inputRefs: [hoursRef, minutesRef, secondsRef, meridiemRef] 
    }));

    React.useEffect(() => {
        if (invalidTime) {
            setError && setError(true);
            setErrorMessage && setErrorMessage('Invalid time');
        }
        else {
            setError && setError(false);
            setErrorMessage && setErrorMessage('');
        }
    }, [invalidTime, setError, setErrorMessage])

    return (
        <div
            className='flex items-center space-x-0.5 cursor-text w-full'
            onClick={handleClick}
        >
            <input
                ref={hoursRef}
                className={cn(
                    'w-6 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidTime ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={time.hours}
                onKeyDown={(e) => handleKeyDown(e, 'hours')}
                onClick={handleClick}
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
                onClick={handleClick}
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
                onClick={handleClick}
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
                onClick={handleClick}
                readOnly
            />
        </div>
    )
})

TimeInput.displayName = 'TimeInput'
