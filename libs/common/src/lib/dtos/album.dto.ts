import { EntityBlueprint } from "@entity-space/common";
import { ArtistDtoBlueprint } from "./artist.dto";
import { DatabaseRecordDtoBlueprint } from "./database-record.dto";

const { register, id, string, number, entity, optional } = EntityBlueprint;

export class AlbumDtoBlueprint extends DatabaseRecordDtoBlueprint {
    id = id();
    name = string();
    artistId = number();
    artist = entity(ArtistDtoBlueprint, this.artistId, artist => artist.id, { optional });
}

register(AlbumDtoBlueprint, { name: "album" });

export type AlbumDto = EntityBlueprint.Instance<AlbumDtoBlueprint>;
