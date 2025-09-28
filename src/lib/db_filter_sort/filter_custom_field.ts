import { z } from "zod";
import { CustomFieldFilterSchema } from "@/lib/search_params";

export type CustomFieldFilter = z.infer<typeof CustomFieldFilterSchema> | undefined;

export type FilterBuild = {
  andConditions?: any[];
};

export function filterCustomField(customField: CustomFieldFilter, _pipeline: any[]): FilterBuild {
  if (!customField || Object.keys(customField).length === 0) return {};

  const customFieldConditions: any[] = [];

  for (const [fieldId, filterValue] of Object.entries(customField)) {
    let fieldCondition: any = {};
    try {
      if (filterValue && typeof filterValue === "object" && !Array.isArray(filterValue)) {
        if (!("from" in filterValue) && !("to" in filterValue) && !("start" in filterValue) && !("end" in filterValue)) {
          const kvConditions: any[] = [];
          for (const [key, value] of Object.entries(filterValue)) {
            if (value && typeof value === "string" && value.trim() !== "") {
              kvConditions.push({ [`kv_values.${fieldId}.${key}`]: { $regex: value, $options: "i" } });
            }
          }
          if (kvConditions.length > 0) {
            fieldCondition = kvConditions.length === 1 ? kvConditions[0] : { $and: kvConditions };
          }
        } else if ("from" in filterValue || "to" in filterValue) {
          const conditions: any[] = [];
          if ('from' in filterValue && filterValue.from && typeof filterValue.from === "string") {
            const fromDate = new Date(filterValue.from).toISOString().split("T")[0];
            conditions.push({ [`values.${fieldId}`]: { $gte: fromDate } });
          }
          if ('to' in filterValue && filterValue.to && typeof filterValue.to === "string") {
            const toDate = new Date(filterValue.to).toISOString().split("T")[0];
            conditions.push({ [`values.${fieldId}`]: { $lte: toDate } });
          }
          if (conditions.length > 0) {
            fieldCondition = conditions.length === 1 ? conditions[0] : { $and: conditions };
          }
        } else if ("start" in filterValue || "end" in filterValue) {
          const conditions: any[] = [];
          if ('start' in filterValue && filterValue.start) {
            conditions.push({ [`values.${fieldId}`]: { $gte: filterValue.start } });
          }
          if ('end' in filterValue && filterValue.end) {
            conditions.push({ [`values.${fieldId}`]: { $lte: filterValue.end } });
          }
          if (conditions.length > 0) {
            fieldCondition = conditions.length === 1 ? conditions[0] : { $and: conditions };
          }
        }
      } else if (Array.isArray(filterValue)) {
        fieldCondition = { [`values.${fieldId}`]: { $in: filterValue } };
      } else if (typeof filterValue === "string") {
        fieldCondition = { [`values.${fieldId}`]: { $regex: filterValue, $options: "i" } };
      } else if (typeof filterValue === "number") {
        fieldCondition = {
          $or: [
            { [`values.${fieldId}`]: filterValue },
            { [`values.${fieldId}`]: { $regex: filterValue.toString(), $options: "i" } },
          ],
        };
      } else {
        fieldCondition = { [`values.${fieldId}`]: filterValue };
      }
    } catch {
      continue;
    }

    if (Object.keys(fieldCondition).length > 0) {
      customFieldConditions.push(fieldCondition);
    }
  }

  if (customFieldConditions.length === 0) return {};
  return { andConditions: customFieldConditions };
}


