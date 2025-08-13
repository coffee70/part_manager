import { Priority } from "@/types/collections";

export type FilterBuild = { match?: Record<string, any> };

export function filterPriority(priority: Priority | undefined, _pipeline: any[]): FilterBuild {
  if (!priority) return {};
  return { match: { priority } };
}


