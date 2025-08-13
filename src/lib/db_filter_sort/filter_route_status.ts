import { RouteState } from "@/components/route_builder/list_view/types";

export type FilterBuild = { orConditions?: any[] };

export function filterRouteStatus(routeStatus: RouteState | RouteState[] | undefined, _pipeline: any[]): FilterBuild {
  if (!routeStatus) return {};
  const orConditions = Array.isArray(routeStatus)
    ? [{ 'route.state': { $in: routeStatus } }]
    : [{ 'route.state': routeStatus }];
  return { orConditions };
}


