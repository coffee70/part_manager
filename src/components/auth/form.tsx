"use client";
import React from "react";
import { useFormState } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'> & {
    action: (prevState: any, formData: FormData) => Promise<ActionResult>;
};

export function Form({
	children,
	action,
    ...props
}: Props) {
	const [state, formAction] = useFormState(action, {
		error: null
	});
	return (
		<form action={formAction} {...props}>
			{state.error && <Alert variant='destructive'>
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{state.error}</AlertDescription>
			</Alert>}
			{children}
		</form>
	);
}

export interface ActionResult {
	error: string | null;
}