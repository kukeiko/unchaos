import { EntityBlueprint } from "@entity-space/common";

const { register, id, string } = EntityBlueprint;

export class ArtistDtoBlueprint {
    id = id();
    name = string();
}

register(ArtistDtoBlueprint, { name: "artist" });

export type ArtistDto = EntityBlueprint.Instance<ArtistDtoBlueprint>;
