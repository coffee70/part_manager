export type FilterBuild = { match?: Record<string, any> };

export function filterSearch(search: string | undefined, _pipeline: any[]): FilterBuild {
  if (!search) return {};
  return { match: { number: { $regex: search, $options: 'i' } } };
}


