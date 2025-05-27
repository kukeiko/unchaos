import { EntityBlueprint } from "@entity-space/common";

const { register, id, string, entity } = EntityBlueprint;

export class UserDtoBlueprint {
    id = id();
    name = string();
}

register(UserDtoBlueprint, { name: "user", sort: (a, b) => a.name.localeCompare(b.name) });

export type UserDto = EntityBlueprint.Instance<UserDtoBlueprint>;
export type UserCreatableDto = EntityBlueprint.Creatable<UserDtoBlueprint>