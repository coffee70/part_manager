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

export function pluralToSingular(s: string): string {
    if (s.endsWith('ies')) {
        return s.slice(0, -3) + 'y';
    } else if (s.endsWith('es')) {
        return s.slice(0, -2);
    } else if (s.endsWith('s')) {
        return s.slice(0, -1);
    } else {
        return s;
    }
}