'use client'
import AddStartingStep from "./add_starting_step"
import AddStep from "./add_step"
import Delete from "./delete"
import Save from "./save"

export default function Toolbar() {
    return (
        <div className="absolute bottom-4 right-4 flex gap-2">
            <Delete />
            <AddStartingStep />
            <AddStep />
            <Save />
        </div>
    )
}