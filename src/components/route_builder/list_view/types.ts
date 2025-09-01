import { Route } from "@/types/collections";

export type RouteFormState = {
    route: Route;
};

export interface Instance {
    _id: string;
    number: string;
}

export interface Router {
    _id: string;
    name: string;
}