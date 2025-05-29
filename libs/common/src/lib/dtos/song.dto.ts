import { EntityBlueprint } from "@entity-space/common";
import { AlbumDtoBlueprint } from "./album.dto";
import { ArtistDtoBlueprint } from "./artist.dto";
import { DatabaseRecordDtoBlueprint } from "./database-record.dto";

const { register, id, string, number, entity, array, optional, readonly } = EntityBlueprint;

export class SongDtoBlueprint extends DatabaseRecordDtoBlueprint {
    id = id();
    name = string();
    artistId = number();
    artist = entity(ArtistDtoBlueprint, this.artistId, artist => artist.id, { optional });
    albumId = number();
    album = entity(AlbumDtoBlueprint, this.albumId, album => album.id, { optional });
    youtube = string({ optional });
}

register(SongDtoBlueprint, { name: "song", sort: (a, b) => a.name.localeCompare(b.name) });

export type SongDto = EntityBlueprint.Instance<SongDtoBlueprint>;
