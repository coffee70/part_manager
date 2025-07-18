/**
 * Converts a camelCase string to a readable label format with spaces.
 * Example: "camelCase" -> "Camel Case"
 * 
 * @param camelCase - The camelCase string to convert
 * @returns The formatted string with spaces between words and first letter capitalized
 */
export function camelCaseToLabel(camelCase: string) {
    return camelCase.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

/**
 * Converts a space-separated label string to camelCase format.
 * Example: "Label With Spaces" -> "labelWithSpaces"
 * 
 * @param label - The space-separated string to convert
 * @returns The camelCase formatted string with first letter lowercase
 * 
 * @example
 * labelToCamelCase("My Label") // returns "myLabel"
 * labelToCamelCase("UPPER CASE") // returns "upperCase"
 * labelToCamelCase("  extra  spaces  ") // returns "extraSpaces"
 */
export function labelToCamelCase(label: string): string {
    return label
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, '');
}

/**
 * Converts a snake_case string to a readable label format with spaces and proper capitalization.
 * Example: "snake_case_example" -> "Snake Case Example"
 * 
 * @param snakeCase - The snake_case string to convert
 * @returns The formatted string with spaces between words and each word capitalized
 * 
 * @example
 * snakeCaseToLabel("user_name") // returns "User Name"
 * snakeCaseToLabel("first_last_name") // returns "First Last Name"
 * snakeCaseToLabel("api_key") // returns "Api Key"
 */
export function snakeCaseToLabel(snakeCase: string): string {
    return snakeCase
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Converts a plural English word to its singular form using common English rules.
 * 
 * Rules:
 * - Words ending in 'ies' -> 'y' (e.g., "cities" -> "city")
 * - Words ending in 'es' -> remove 'es' (e.g., "boxes" -> "box")
 * - Words ending in 's' -> remove 's' (e.g., "cars" -> "car")
 * - Words not ending in above -> unchanged (e.g., "fish" -> "fish")
 * 
 * @param s - The plural word to convert
 * @returns The singular form of the word
 * 
 * @example
 * pluralToSingular("cities") // returns "city"
 * pluralToSingular("boxes") // returns "box"
 * pluralToSingular("cars") // returns "car"
 * pluralToSingular("fish") // returns "fish"
 */
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