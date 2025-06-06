import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityServiceContainer } from "@entity-space/common";
import { AlbumDto, AlbumDtoBlueprint, ArtistDto, ArtistDtoBlueprint, SongDto, SongDtoBlueprint } from "@unchaos/common";
import { lastValueFrom } from "rxjs";
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
        this.entityServices
            .for(SongDtoBlueprint)
            .addSource({
                // [todo] criteria would be more convenient if we didn't have to access like this: "albumId?.value" but instead just "albumId"
                //  - supporting multiple criteria types should still be possible, but just having one type is probably much more common
                // [idea] for this source: where: ({ optional, equals }) => ({ albumId: optional(equals()), artistId: optional(equals()) })
                // and for other sources: where: ({ optional, equals, inArray }) => ({ albumId: optional(equals(), inArray()), artistId: equals() })
                // [note] optional needs to be the wrapper, as a single where property contains only optional or only required.
                // the type for albumId: optional(equals()) would be "number | undefined",
                // the type for albumId: optional(equals(), inArray()) would be { type: "equals", value: number } | { type: "in-array", value: number } undefined
                // [idea #2]: where: { artistId: "equals?" }

                where: { albumId: { $inArray: true, $optional: true }, artistId: { $inArray: true, $optional: true } },
                select: { album: true, artist: true },
                load: ({ criteria: { albumId, artistId }, selection: { album, artist } }) => {
                    return this.httpClient.get<SongDto[]>("api/songs", {
                        params: toQueryParams({
                            album,
                            artist,
                            albumId: albumId?.value,
                            artistId: artistId?.value,
                        }),
                    });
                },
            })
            .addCreateOneMutator({
                create: ({ entity }) => lastValueFrom(this.httpClient.post<SongDto>("api/songs", entity)),
            })
            .addUpdateOneMutator({
                update: ({ entity }) => lastValueFrom(this.httpClient.put<SongDto>(`api/songs`, entity)),
            })
            .addDeleteOneMutator({
                delete: async ({ entity }) => {
                    await lastValueFrom(this.httpClient.delete(`api/songs/${entity.id}`));
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
