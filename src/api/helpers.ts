export function response(status: number, body?: { [key: string]: any }) {
    if (status >= 400 && status < 500) {
        return new Response(JSON.stringify({ error: "Invalid request!"}), {
            status: status,
            headers: {
                "Content-Type": "application/json"
            },
        })
    }
    if (status >= 500) {
        return new Response(JSON.stringify({ error: "Internal server error!"}), {
            status: status,
            headers: {
                "Content-Type": "application/json"
            },
        })
    }
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json"
        },
    })
}