// For link filter, we need to add $lookup stages and prepare match conditions, then cleanup

export type LinkFilter = Record<string, string> | undefined;

export type FilterBuild = {
  preMatchStages?: any[];
  linkMatchConditions?: any[];
  cleanupProjectFields?: string[];
};

export function filterLink(link: LinkFilter, _pipeline: any[]): FilterBuild {
  if (!link || Object.keys(link).length === 0) return {};

  const entries = Object.entries(link)
    .map(([contextId, value]) => ({ contextId, value: value.trim() }))
    .filter((e) => e.value !== "");

  if (entries.length === 0) return {};

  const preMatchStages: any[] = [];
  const linkMatchConditions: any[] = [];
  const cleanupProjectFields: string[] = [];

  for (const { contextId, value } of entries) {
    preMatchStages.push({
      $lookup: {
        from: contextId,
        let: {
          linkIds: {
            $map: {
              input: {
                $filter: {
                  input: { $ifNull: ["$links", []] },
                  cond: { $eq: ["$$this.contextId", contextId] },
                },
              },
              as: "link",
              in: { $toObjectId: "$$link.instanceId" },
            },
          },
        },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$linkIds"] },
              number: { $regex: value, $options: "i" },
            },
          },
          { $project: { number: 1 } },
        ],
        as: `linkedInstances_${contextId}`,
      },
    });
    linkMatchConditions.push({ [`linkedInstances_${contextId}`]: { $ne: [] } });
    cleanupProjectFields.push(`linkedInstances_${contextId}`);
  }

  return { preMatchStages, linkMatchConditions, cleanupProjectFields };
}


