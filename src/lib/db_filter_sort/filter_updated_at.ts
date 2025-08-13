export type DateRange = { from?: Date; to?: Date } | undefined;
export type FilterBuild = {
  match?: Record<string, any>;
};

export function filterUpdatedAt(updatedAt: DateRange, _pipeline: any[]): FilterBuild {
  if (!updatedAt) return {};
  const match: Record<string, any> = {};
  match.updatedAt = {} as any;
  if (updatedAt.from) (match.updatedAt as any).$gte = updatedAt.from;
  if (updatedAt.to) (match.updatedAt as any).$lte = updatedAt.to;
  return { match };
}


