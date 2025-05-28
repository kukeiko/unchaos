import { ArtistDto, SongDto, UserDto } from "@unchaos/common";
import { AlbumDto } from "libs/common/src/lib/dtos/album.dto";

export interface Entities {
    albums: AlbumDto[];
    artists: ArtistDto[];
    songs: SongDto[];
    users: UserDto[];
}
