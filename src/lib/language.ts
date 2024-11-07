export function camelCaseToLabel(camelCase: string) {
    return camelCase.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

export function labelToCamelCase(label: string): string {
    return label
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, '');
}