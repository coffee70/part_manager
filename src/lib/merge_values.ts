import { Field, Section, Values } from '@/types/collections';

export const mergeValues = (sections: Array<Section & { fields: Field[] }>, values: Values) => {
    return sections.map(section => {
        const sectionFields = section.fields.map(field => {
            const fieldData = values[field._id]
            return {
                ...field,
                value: fieldData,
            }
        })
        return {
            ...section,
            fields: sectionFields,
        }
    })
}