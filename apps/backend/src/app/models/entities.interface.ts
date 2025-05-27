import { ArtistDto, SongDto, UserDto } from "@unchaos/common";

export interface Entities {
    artists: ArtistDto[];
    users: UserDto[];
    songs: SongDto[];
}
