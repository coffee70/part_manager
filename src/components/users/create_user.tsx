import { Button } from "../ui/button"
import { PlusIcon } from 'lucide-react';
import UserForm from "./user_form";

export default function CreateUser() {
    return (
        <UserForm>
            <Button variant='secondary'>
                <div className="flex items-center">
                    <PlusIcon size={20} className='pr-1' />
                    <span className="pr-1">New User</span>
                </div>
            </Button>
        </UserForm>
    )
}