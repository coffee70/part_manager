'use client'
import React from 'react';
import { cn } from '@/lib/utils';
import { FieldRefs } from '../fields/components/fields/base';

type Input = 'month' | 'day' | 'year'

type Date = {
    month: string;
    day: string;
    year: string;
}

type UseDateInputProps = {
    setDate: (date: string) => void;
}

const defaults: Record<Input, string> = {
    month: 'MM',
    day: 'DD',
    year: 'YYYY'
}

export function useDateInput({ setDate }: UseDateInputProps) {

    const [_date, _setDate] = React.useState<Date>({ month: 'MM', day: 'DD', year: 'YYYY' });

    const monthRef = React.useRef<HTMLInputElement>(null);
    const dayRef = React.useRef<HTMLInputElement>(null);
    const yearRef = React.useRef<HTMLInputElement>(null);

    // update the date on change
    React.useEffect(() => {
        setDate(_date.month + '/' + _date.day + '/' + _date.year)
    }, [_date, setDate])

    const getPrevRef = (input: Input) => {
        switch (input) {
            case 'month':
                return undefined;
            case 'day':
                return monthRef;
            case 'year':
                return dayRef;
        }
    }

    const getNextRef = (input: Input) => {
        switch (input) {
            case 'month':
                return dayRef;
            case 'day':
                return yearRef;
            case 'year':
                return undefined;
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, input: Input) => {
        const key = e.key;

        if (/[0-9]/.test(key)) {
            // check if date input contains any letters
            if (isNaN(parseInt(_date[input]))) {
                _setDate({ ..._date, [input]: '0' + key })
            }
            else {
                _setDate({ ..._date, [input]: _date[input][1] + key })
            }
        }

        if (key === 'Backspace') {
            if (_date[input][0] === '0') {
                _setDate({ ..._date, [input]: defaults[input] })
            }
            else if (!isNaN(parseInt(_date[input]))) {
                _setDate({ ..._date, [input]: '0' + _date[input][0] })
            }
            else {
                getPrevRef(input)?.current?.focus();
            }
        }

        if (key === 'Tab') {
            e.preventDefault();
            getNextRef(input)?.current?.focus();
        }
    }

    const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;

        if (/[0-9]/.test(key)) {
            // find the first non-zero index in the year
            if (isNaN(parseInt(_date.year))) {
                _setDate({ ..._date, year: '000' + key })
            }
            else {
                // if there are no zeros
                if (_date.year[0] !== '0') {
                    _setDate({ ..._date, year: _date.year.slice(1) + key })
                }
                // get the number of zeros before the first non-zero digit
                else {
                    for (let i = 0; i < _date.year.length; i++) {
                        if (_date.year[i] !== '0') {
                            _setDate({ ..._date, year: _date.year.slice(0, i - 1) + _date.year.slice(i) + key })
                            break
                        }
                    }
                }
            }
        }

        if (key === 'Backspace') {
            if (!isNaN(parseInt(_date.year))) {
                for (let i = 0; i < _date.year.length; i++) {
                    if (_date.year[i] !== '0') {
                        if (i === 3) {
                            _setDate({ ..._date, year: defaults.year })
                        }
                        else {
                            _setDate({ ..._date, year: _date.year.slice(0, i) + '0' + _date.year.slice(i + 1) })
                        }
                        break
                    }
                }
            }
            else {
                getPrevRef('year')?.current?.focus();
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // handle focus logic when input is clicked on
        switch (e.target) {
            case monthRef.current:
                monthRef.current?.focus();
                return;
            case dayRef.current:
                dayRef.current?.focus();
                return;
            case yearRef.current:
                yearRef.current?.focus();
                return;
        }

        if (_date.month === defaults.month) {
            monthRef.current?.focus();
        }
        else if (_date.day === defaults.day) {
            dayRef.current?.focus();
        }
        else if (_date.year === defaults.year) {
            yearRef.current?.focus();
        }
    }

    const invalidDate = React.useMemo(() => {
        // if any fields contain default return false since the user is still inputting values
        if (_date.month === defaults.month || _date.day === defaults.day || _date.year === defaults.year) {
            return false
        }
        if (isNaN(new Date(_date.year + "/" + _date.month + "/" + _date.day).getTime())) {
            return true
        }

        return false
    }, [_date])

    return {
        monthRef,
        dayRef,
        yearRef,
        _date,
        invalidDate,
        handleKeyDown,
        handleYearKeyDown,
        handleClick,
    }
}

type DateInputProps = {
    setDate: (date: string) => void;
    setError?: (error: boolean) => void;
    setErrorMessage?: (message: string) => void;
}

export const DateInput = React.forwardRef<FieldRefs, DateInputProps>((props, ref) => {

    const {
        setDate,
        setError,
        setErrorMessage,
    } = props;

    const {
        monthRef,
        dayRef,
        yearRef,
        _date,
        invalidDate,
        handleKeyDown,
        handleYearKeyDown,
        handleClick,
    } = useDateInput({ setDate });

    React.useImperativeHandle(ref, () => ({
        inputRefs: [monthRef, dayRef, yearRef]
    }))

    React.useEffect(() => {
        if (invalidDate) {
            setError && setError(true);
            setErrorMessage && setErrorMessage('Invalid date');
        }
        else {
            setError && setError(false);
            setErrorMessage && setErrorMessage('');
        }
    }, [invalidDate, setError, setErrorMessage])

    return (
        <div
            className="flex items-center space-x-0.5 cursor-text w-full"
            onClick={handleClick}
        >
            <input
                ref={monthRef}
                className={cn(
                    'w-8 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidDate ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={_date.month}
                onKeyDown={(e) => handleKeyDown(e, 'month')}
                onClick={handleClick}
                readOnly
            />
            <span>-</span>
            <input
                ref={dayRef}
                className={cn(
                    'w-7 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidDate ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={2}
                value={_date.day}
                onKeyDown={(e) => handleKeyDown(e, 'day')}
                onClick={handleClick}
                readOnly
            />
            <span>-</span>
            <input
                ref={yearRef}
                className={cn(
                    'w-11 text-center rounded-sm caret-transparent bg-transparent focus:outline-none',
                    invalidDate ? "focus:bg-red-300" : "focus:bg-foreground"
                )}
                maxLength={4}
                value={_date.year}
                onKeyDown={handleYearKeyDown}
                onClick={handleClick}
                readOnly
            />
        </div>
    )
})

DateInput.displayName = 'DateInput'