import { Priority } from "@/types/collections";

export type FilterBuild = { match?: Record<string, any> };

export function filterPriority(priorities: Priority[] | Priority | undefined, _pipeline: any[]): FilterBuild {
  if (!priorities) return {};
  if (Array.isArray(priorities)) {
    return { match: { priority: { $in: priorities } } };
  }
  return { match: { priority: priorities } };
}


