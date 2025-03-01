'use server'
import { redirect } from "next/navigation";
import { invalidateSession } from "@/lib/session";
import { getCurrentSession } from "./get_current_session";
import { deleteSessionTokenCookie } from "@/lib/cookies";
import { router } from "@/lib/url";

export async function logout(): Promise<ActionResult> {
	const { session } = await getCurrentSession();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}

	await invalidateSession(session._id);

	deleteSessionTokenCookie();
	redirect(router().auth().login());
}

interface ActionResult {
    error: string;
}