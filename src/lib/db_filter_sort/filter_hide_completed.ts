import { RouteState } from "@/components/route_builder/list_view/types";

export type FilterBuild = {
  match?: Record<string, any>;
  orConditions?: any[];
  andConditions?: any[];
  linkMatchConditions?: any[];
  cleanupProjectFields?: string[];
};

export function filterHideCompleted(hideCompleted: boolean | undefined, _pipeline: any[]): FilterBuild {
  if (!hideCompleted) return {};
  return {
    match: {
      "route.state": { $ne: RouteState.Completed }
    },
  };
}


