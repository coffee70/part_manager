import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Input } from '@/components/ui/fields/input';
import Select from '@/components/ui/fields/select';
import { stepTypes } from "@/types/collections";
import { Button } from "../ui/button";

type Props = {
    children: React.ReactNode;
}

export default function StepForm({ children }: Props) {

    const title = 'Create Step';
    const description = 'Create a new step; add a step to the route builder';

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-[560px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <VisuallyHidden.Root>
                            {description}
                        </VisuallyHidden.Root>
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6">
                    <div className='overflow-y-auto space-y-1'>
                        <Input
                            id='name'
                            label='Name'
                            description='The name of the step'
                            type='text'
                        />
                        <Select
                            id='type'
                            label='Type'
                            description='The type of step'
                            options={[...stepTypes]}
                        />
                    </div>
                    <Button
                        className="w-full"
                        type='submit'
                    >Save</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}