import { EntityBlueprint } from "@entity-space/common";
import { ArtistDtoBlueprint } from "./artist.dto";
import { RecordMetadataDtoBlueprint } from "./record-metadata.dto";

const { register, id, string, number, entity, optional } = EntityBlueprint;

export class AlbumDtoBlueprint {
    id = id();
    name = string();
    artistId = number();
    artist = entity(ArtistDtoBlueprint, this.artistId, artist => artist.id, { optional });
    metadata = entity(RecordMetadataDtoBlueprint);
}

register(AlbumDtoBlueprint, { name: "album" });

export type AlbumDto = EntityBlueprint.Instance<AlbumDtoBlueprint>;
