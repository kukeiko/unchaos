import { NzTableQueryParams } from "ng-zorro-antd/table";

export function nzTableQueryParamsToCriteria<T extends Record<string, any>>(queryParams: NzTableQueryParams): T {
    const criteria: Record<string, any> = {};

    for (const filter of queryParams.filter) {
        criteria[filter.key] = filter.value;
    }

    return criteria as T;
}
