export type URLSetter = (...args: any[]) => string;

export const fieldURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/fields`;
    return `/fields?modelId=${modelId}`;
}

export const modelURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/models`;
    return `/models?modelId=${modelId}`;
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
        return `${this._base}/?modelId=${modelId}`;
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