import { priorities } from "@/types/collections";

export function sort(sortBy: string | undefined, sortOrder: 'asc' | 'desc' | undefined, pipeline: any[]) {
  if (!sortBy) return;
  if (sortBy === 'priority') {
    pipeline.push(
      {
        $addFields: {
          priorityOrder: {
            $indexOfArray: [priorities, '$priority']
          }
        }
      },
      {
        $sort: { priorityOrder: sortOrder === 'asc' ? 1 : -1 }
      },
      {
        $project: { priorityOrder: 0 }
      }
    );
  } else {
    pipeline.push({ $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } });
  }
}


