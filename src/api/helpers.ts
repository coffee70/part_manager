export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

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