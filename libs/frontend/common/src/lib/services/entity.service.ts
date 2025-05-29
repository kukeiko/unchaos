import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityServiceContainer } from "@entity-space/common";
import { AlbumDto, AlbumDtoBlueprint, ArtistDto, ArtistDtoBlueprint, SongDto, SongDtoBlueprint } from "@unchaos/common";
import { toQueryParams } from "../utils";

@Injectable({ providedIn: "root" })
export class EntityService {
    constructor(
        private readonly entityServices: EntityServiceContainer,
        private readonly httpClient: HttpClient,
    ) {}

    useArtists(): this {
        this.entityServices
            .for(ArtistDtoBlueprint)
            .addSource({
                where: { id: { $equals: true } },
                load: ({ criteria: { id } }) => this.httpClient.get<ArtistDto>(`api/artists/${id.value}`),
            })
            .addSource({
                load: () => this.httpClient.get<ArtistDto[]>("api/artists"),
            });

        return this;
    }

    useAlbums(): this {
        this.entityServices.for(AlbumDtoBlueprint).addSource({
            load: () => this.httpClient.get<AlbumDto[]>("api/albums"),
        });

        return this;
    }

    useSongs(): this {
        this.entityServices.for(SongDtoBlueprint).addSource({
            where: { albumId: { $inArray: true, $optional: true }, artistId: { $inArray: true, $optional: true } },
            select: { album: true, artist: true },
            load: ({ criteria: { albumId, artistId }, selection: { album, artist } }) => {
                // [todo] it is hard to understand which values "album" and "artist" can be
                // [todo] selection values are inconvenient:
                //  - if user provides "album: true", then "album" should be "true | undefined"
                //  - if they provide an object for "album", it should be "TypedEntitySelection<T> | undefined" (or maybe PackedEntitySelection<T>)
                // [todo] criteria would be more convenient if we didn't have to access like this: "albumId?.value" but instead just "albumId"
                //  - supporting multiple criteria types should still be possible, but just having one type is probably much more common
                return this.httpClient.get<SongDto[]>("api/songs", {
                    params: toQueryParams({
                        album: album ? true : undefined,
                        artist: artist ? true : undefined,
                        albumId: albumId?.value,
                        artistId: artistId?.value,
                    }),
                });
            },
        });

        return this;
    }

    useSongsNoExpand(): this {
        this.entityServices.for(SongDtoBlueprint).addSource({
            where: { albumId: { $inArray: true, $optional: true }, artistId: { $inArray: true, $optional: true } },
            load: ({ criteria: { albumId, artistId } }) => {
                return this.httpClient.get<SongDto[]>("api/songs", {
                    params: toQueryParams({
                        albumId: albumId?.value,
                        artistId: artistId?.value,
                    }),
                });
            },
        });

        return this;
    }
}
