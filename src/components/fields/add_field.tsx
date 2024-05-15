import { Dialog, DialogTrigger, DialogHeader, DialogContent } from "../ui/dialog"
import { Combobox } from "../ui/combobox"

const fieldOptions = [
    { id: 1, value: "Text" },
    { id: 2, value: "Numerical" },
    { id: 3, value: "Date" },
    { id: 4, value: "Time" },
    { id: 5, value: "Select" },
]

export default function AddField() {
    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <button>Hello</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Add Field</DialogHeader>
                <Combobox options={fieldOptions} placeholder="Field type"/>
            </DialogContent>
        </Dialog>
        </>
    )
}