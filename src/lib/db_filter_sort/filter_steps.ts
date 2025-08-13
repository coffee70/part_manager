// Adds $addFields to compute currentStepInstanceId and OR condition
export type FilterBuild = {
  addFieldsStages?: any[];
  orConditions?: any[];
};

export function filterSteps(steps: string | string[] | undefined, pipeline: any[]): FilterBuild {
  if (!steps) return {};
  const addFieldsStages = [
    {
      $addFields: {
        currentStepInstanceId: {
          $let: {
            vars: {
              matchingNode: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$route.nodes",
                      as: "node",
                      cond: { $eq: ["$$node.id", "$route.currentStepId"] }
                    }
                  },
                  0
                ]
              }
            },
            in: "$$matchingNode.instanceId"
          }
        }
      }
    }
  ];
  const orConditions = Array.isArray(steps)
    ? [{ currentStepInstanceId: { $in: steps } }]
    : [{ currentStepInstanceId: steps }];
  return { addFieldsStages, orConditions };
}


