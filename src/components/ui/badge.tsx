import * as React from "react"

type Props = {
  label: string;
  color: string;
}

export default function Badge(props: Props) {
  const { label, color } = props
  return (
    <div
      className="inline-flex items-center rounded-sm px-2 text-xs text-white font-bold"
      style={{ backgroundColor: color }}
    >{label.toUpperCase()}</div>
  )
}


