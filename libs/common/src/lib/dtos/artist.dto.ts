import { EntityBlueprint } from "@entity-space/common";
import { RecordMetadataDtoBlueprint } from "./record-metadata.dto";

const { register, id, string, entity, readonly } = EntityBlueprint;

export class ArtistDtoBlueprint {
    id = id();
    name = string();
    metadata = entity(RecordMetadataDtoBlueprint, { readonly });
}

register(ArtistDtoBlueprint, { name: "artist", sort: (a, b) => a.name.localeCompare(b.name) });

export type ArtistDto = EntityBlueprint.Instance<ArtistDtoBlueprint>;
export type ArtistCreatableDto = EntityBlueprint.Creatable<ArtistDtoBlueprint>;
