export type CustomFieldFilter = Record<string, string> | undefined;

export type FilterBuild = {
  andConditions?: any[];
};

export function filterCustomField(customField: CustomFieldFilter, _pipeline: any[]): FilterBuild {
  if (!customField || Object.keys(customField).length === 0) return {};

  const customFieldConditions: any[] = [];

  for (const [fieldId, filterValue] of Object.entries(customField)) {
    let fieldCondition: any = {};
    try {
      const parsedValue = JSON.parse(filterValue);

      if (parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)) {
        if (!("from" in parsedValue) && !("to" in parsedValue) && !("start" in parsedValue) && !("end" in parsedValue)) {
          const kvConditions: any[] = [];
          for (const [key, value] of Object.entries(parsedValue)) {
            if (value && typeof value === "string" && value.trim() !== "") {
              kvConditions.push({ [`kv_values.${fieldId}.${key}`]: { $regex: value, $options: "i" } });
            }
          }
          if (kvConditions.length > 0) {
            fieldCondition = kvConditions.length === 1 ? kvConditions[0] : { $and: kvConditions };
          }
        } else if ("from" in parsedValue || "to" in parsedValue) {
          const conditions: any[] = [];
          if (parsedValue.from) {
            const fromDate = new Date(parsedValue.from).toISOString().split("T")[0];
            conditions.push({ [`values.${fieldId}`]: { $gte: fromDate } });
          }
          if (parsedValue.to) {
            const toDate = new Date(parsedValue.to).toISOString().split("T")[0];
            conditions.push({ [`values.${fieldId}`]: { $lte: toDate } });
          }
          if (conditions.length > 0) {
            fieldCondition = conditions.length === 1 ? conditions[0] : { $and: conditions };
          }
        } else if ("start" in parsedValue || "end" in parsedValue) {
          const conditions: any[] = [];
          if (parsedValue.start) {
            conditions.push({ [`values.${fieldId}`]: { $gte: parsedValue.start } });
          }
          if (parsedValue.end) {
            conditions.push({ [`values.${fieldId}`]: { $lte: parsedValue.end } });
          }
          if (conditions.length > 0) {
            fieldCondition = conditions.length === 1 ? conditions[0] : { $and: conditions };
          }
        }
      } else if (Array.isArray(parsedValue)) {
        fieldCondition = { [`values.${fieldId}`]: { $in: parsedValue } };
      } else if (typeof parsedValue === "string") {
        fieldCondition = { [`values.${fieldId}`]: { $regex: parsedValue, $options: "i" } };
      } else if (typeof parsedValue === "number") {
        fieldCondition = {
          $or: [
            { [`values.${fieldId}`]: parsedValue },
            { [`values.${fieldId}`]: { $regex: parsedValue.toString(), $options: "i" } },
          ],
        };
      } else {
        fieldCondition = { [`values.${fieldId}`]: parsedValue };
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


