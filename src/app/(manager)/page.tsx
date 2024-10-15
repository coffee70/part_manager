import { validateRequest } from "@/lib/auth";

export default async function Page() {
    const { user } = await validateRequest();
    return user ? (
        <div>
            <h1>Welcome {user.username}</h1>
        </div>
    ) : (
        <div>
            <h1>Not logged in</h1>
        </div>
    )
}





