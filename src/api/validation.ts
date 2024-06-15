import { Field, FieldModel, FieldType } from '@prisma/client';

type ValidationError = {
    field: string;
    message: string;
}

function getValidationError(field: Field, message: string): ValidationError {
    return {
        field: field.name,
        message: message
    };
}

async function getFields(model: FieldModel) {
    return await prisma.field.findMany({
        where: {
            model: model
        }
    });
}

function validateTextField(field: Field, json_parsed: any) {
    return typeof json_parsed[field.name] === 'string';
}

function validateNumberField(field: Field, json_parsed: any) {
    return typeof json_parsed[field.name] === 'number';
}

function validateDateField(field: Field, json_parsed: any) {
    return typeof json_parsed[field.name] === 'string' && !isNaN(Date.parse(json_parsed[field.name]));
}

function validateSelectField(field: Field, json_parsed: any) {
    if (!field.options || !Array.isArray(field.options)) throw new Error('Options for select field not found');
    if (field.multiple) {
        if (!Array.isArray(json_parsed[field.name])) return false;
        for (const option of json_parsed[field.name]) {
            if (!field.options.includes(option) && !field.creative) return false;
        }
    } else {
        if (Array.isArray(json_parsed[field.name])) return false;
        if (!field.options.includes(json_parsed[field.name]) && !field.creative) return false;
    }
    return true;
}

export async function validateJson(json_parsed: any, model: FieldModel): Promise<true | ValidationError[]> {
    const errors: ValidationError[] = [];
    try {
        const data = json_parsed;
        const fields = await getFields(model);
        for (const field of fields) {
            if (!field.nullable && !data[field.name]) {
                errors.push(getValidationError(field, 'Field is required'));
                continue;
            }
            switch (field.type) {
                case FieldType.TEXT:
                    if (!validateTextField(field, data)) {
                        errors.push(getValidationError(field, 'Field is not a string'));
                    };
                    break;
                case FieldType.NUMBER:
                    if (!validateNumberField(field, data)) {
                        errors.push(getValidationError(field, 'Field is not a number'));
                    }
                    break;
                case FieldType.DATE:
                    if (!validateDateField(field, data)) {
                        errors.push(getValidationError(field, 'Field is not a date'));
                    }
                    break;
                case FieldType.SELECT:
                    if (!validateSelectField(field, data)) {
                        errors.push(getValidationError(field, 'Field is not a valid option'));
                    }
                    break;
                default:
                    throw new Error('Field type not found');
            }
        }
    } catch {
        throw new Error('Invalid JSON');
    }
    
    return errors.length ? errors : true;
}
