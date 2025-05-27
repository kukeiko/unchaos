import { EntityBlueprint } from "@entity-space/common";
import { DatabaseRecordDtoBlueprint } from "./database-record.dto";
import { SongDtoBlueprint } from "./song.dto";

const { register, id, string, entity, array, optional } = EntityBlueprint;

export class ArtistDtoBlueprint extends DatabaseRecordDtoBlueprint {
    id = id();
    name = string();
    songs = entity(SongDtoBlueprint, this.id, song => song.artistId, { array, optional });
}

register(ArtistDtoBlueprint, { name: "artist", sort: (a, b) => a.name.localeCompare(b.name) });

export type ArtistDto = EntityBlueprint.Instance<ArtistDtoBlueprint>;
export type ArtistCreatableDto = EntityBlueprint.Creatable<ArtistDtoBlueprint>;
