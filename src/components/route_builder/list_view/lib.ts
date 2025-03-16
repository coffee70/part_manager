import { Route } from "@/components/route_builder/builder_view/types";

export function removeBidirectionalEdges(route: Route) {
    return route.edges.filter(edge => !edge.forBidirectionality);
}