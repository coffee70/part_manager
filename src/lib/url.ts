import { Context, contexts } from "@/types/collections";

export type URLSetter = (...args: any[]) => string;

export const fieldURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/fields`;
    return `/fields?modelId=${modelId}`;
}

export const modelURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/models`;
    return `/models?modelId=${modelId}`;
}

/**
 * Check if the given context is a valid context. Context will be pulled
 * from the front of the URL path.
 * 
 * @param context The context to check
 * @returns True if the context is a valid context, false otherwise
 */
export function isContext(context: string | undefined): context is Context {
    return contexts.some((c: Context) => c === context);
}

class RouterBuilder {
    private _base: string = "/";
    base() {
        return this._base;
    }
    auth() {
        return new AuthRouterBuilder();
    }
    models() {
        return new ModelsRouterBuilder();
    }
    routers() {
        return new RoutersRouterBuilder();
    }
    context(context: Context) {
        return new ContextRouterBuilder(context);
    }
    users() {
        return new UserRouterBuilder();
    }
}

class AuthRouterBuilder {
    private _base: string = "/auth";
    login() {
        return `${this._base}/login`;
    }
    setup() {
        return `${this._base}/setup`;
    }
}

class ModelsRouterBuilder {
    private _base: string = "/models"
    base() {
        return this._base;
    }
    instances() {
        return new ModelsInstancesRouterBuilder();
    }
    admin() {
        return new ModelsAdminRouterBuilder();
    }
}

class ModelsInstancesRouterBuilder {
    private _base: string = "/models/instances";
    base() {
        return this._base;
    }
    model(modelId: string) {
        return `${this._base}/${modelId}`;
    }
    instance(modelId: string, instanceId: string) {
        return `${this._base}/${modelId}?id=${instanceId}`;
    }
    routing(modelId: string, instanceId: string) {
        return `${this._base}/${modelId}/routing/${instanceId}`;
    }
    step(modelId: string, instanceId: string, stepId: string) {
        return `${this._base}/${modelId}/routing/${instanceId}?stepId=${stepId}`;
    }
}

class ModelsAdminRouterBuilder {
    private _base: string = "/models/admin";
    models() {
        return `${this._base}/models`;
    }
    fields() {
        return new ModelsAdminFieldsRouterBuilder();
    }
}

class ModelsAdminFieldsRouterBuilder {
    private _base: string = "/models/admin/fields";
    base() {
        return this._base;
    }
    model(modelId: string) {
        return `${this._base}/?id=${modelId}`;
    }
}

class RoutersRouterBuilder {
    private _base: string = "/routers";
    base() {
        return this._base;
    }
    instances() {
        return new RoutersInstancesRouterBuilder();
    }
    admin() {
        return new RoutersAdminRouterBuilder();
    }
}

class RoutersInstancesRouterBuilder {
    private _base: string = "/routers/instances";
    base() {
        return this._base;
    }
    router(routerId: string) {
        return `${this._base}/${routerId}`;
    }
    instance(routerId: string, instanceId: string) {
        return `${this._base}/${routerId}?id=${instanceId}`;
    }
}

class RoutersAdminRouterBuilder {
    private _base: string = "/routers/admin";
    routers() {
        return `${this._base}/routers`;
    }
    fields() {
        return new RoutersAdminFieldsRouterBuilder();
    }

}

class RoutersAdminFieldsRouterBuilder {
    private _base: string = "/routers/admin/fields";
    base() {
        return this._base;
    }
    router(routerId: string) {
        return `${this._base}/?id=${routerId}`;
    }
}

class ContextRouterBuilder {
    constructor(private _context: Context) {
        this._context = _context;
    }
    private _base: string = `/${this._context}`;
    base() {
        return this._base;
    }
    instances() {
        return new ContextInstancesRouterBuilder(this._context);
    }
    admin() {
        return new ContextAdminRouterBuilder(this._context);
    }
}

class ContextInstancesRouterBuilder {
    constructor(private _context: Context) {
        this._context = _context;
    }
    private _base: string = `/${this._context}/instances`;
    base() {
        return this._base;
    }
    context(id: string) {
        return `${this._base}/${id}`;
    }
    instance(id: string, instanceId: string) {
        return `${this._base}/${id}?id=${instanceId}`;
    }
}

class ContextAdminRouterBuilder {
    constructor(private _context: Context) {
        this._context = _context;
    }
    private _base: string = `/${this._context}/admin`;
    base() {
        return this._base;
    }
    fields() {
        return new ContextAdminFieldsRouterBuilder(this._context);
    }
}

class ContextAdminFieldsRouterBuilder {
    constructor(private _context: Context) {
        this._context = _context;
    }
    private _base: string = `/${this._context}/admin/fields`;
    base() {
        return this._base;
    }
    context(id: string | null) {
        if (!id) return this._base;
        return `${this._base}/?id=${id}`;
    }
}

class UserRouterBuilder {
    private _base: string = "/users";
    base() {
        return this._base;
    }
}

export function router(): RouterBuilder {
    return new RouterBuilder();
}