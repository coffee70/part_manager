export type FilterBuild = { match?: Record<string, any> };

export function filterNumber(number: string | undefined, _pipeline: any[]): FilterBuild {
  if (!number) return {};
  return { match: { number: { $regex: number, $options: 'i' } } };
}


