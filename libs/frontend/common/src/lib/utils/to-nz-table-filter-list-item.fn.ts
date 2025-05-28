import { NzTableFilterList } from "ng-zorro-antd/table";

export function toNzTableFilterListItem(entity: { id: number; name: string }): NzTableFilterList[number] {
    return { text: entity.name, value: entity.id };
}
