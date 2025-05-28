export function toQueryParams(params: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in params) {
        const value = params[key];

        if (value == null || (Array.isArray(value) && !value.length)) {
            continue;
        }

        result[key] = value.toString();
    }

    return result;
}
