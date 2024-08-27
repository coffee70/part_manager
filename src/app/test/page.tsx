'use client'
import React from 'react';
import TimeInput from '@/components/ui/time_input';
   
  export default function AlertDialogDemo() {
    const [time, setTime] = React.useState('12:00:00');
    return (
      <form>
        <TimeInput 
        time={time}
        setTime={time => setTime(time)}/>
      </form>
    )
  }