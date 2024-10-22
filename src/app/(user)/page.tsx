import { getCurrentSession } from "@/server/auth/get_current_session";

export default async function Page() {
    const { user } = await getCurrentSession();
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





