'use client'
import { Combobox } from '@/components/ui/combobox';
import { DataAction } from '@/components/ui/data_action';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { FloatingExample } from '@/hooks/floating.hook';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
import React from 'react';


export default function Page() {
  const [value, setValue] = React.useState<string[]>([])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <button className='bg-gray-200 border'>Trigger</button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        <div className='border border-border'>
          <Combobox
            value={value}
            onChange={(v) => setValue(Array.isArray(v) ? v : [v])}
            options={['One', 'Two', 'Three']}
            multiple
            creative
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

