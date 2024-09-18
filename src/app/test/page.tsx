'use client'
import React from 'react';
import Select from '@/components/fields/components/fields/select';
import TextField from '@/components/fields/components/fields/text';
import NumberField from '@/components/fields/components/fields/number';
import DateField from '@/components/fields/components/fields/date';
import TimeField from '@/components/fields/components/fields/time';
import ParagraphField from '@/components/fields/components/fields/paragraph';

export default function Page() {
  return (
    <div className="flex flex-col space-y-1 p-2">
      <TextField />
      <NumberField />
      <DateField />
      <TimeField  />
      <ParagraphField />
      <Select options={options} />
    </div>
  )
}

const options = [
  {
    value: "Next.js",
  },
  {
    value: "SvelteKit",
  },
  {
    value: "Nuxt.js",
  },
  {
    value: "Remix",
  },
  {
    value: "Astro",
  }
]