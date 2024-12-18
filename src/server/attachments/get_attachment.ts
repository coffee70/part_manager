'use server'
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";

type Input = {
    _id: string;
}

export async function getAttachment(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { _id } = validators.input<Input>(input);

    const response = await fetch(process.env.FILE_GET_URL! + _id, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error('Failed to get file: ' + response.statusText)
    }

    const blob = await response.blob()

    return blob
}
