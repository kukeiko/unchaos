import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityServiceContainer } from "@entity-space/common";
import { SongDto, SongDtoBlueprint } from "@unchaos/common";
import { lastValueFrom } from "rxjs";
import { toQueryParams } from "../utils";

@Injectable({ providedIn: "root" })
export class EntityService {
    constructor(
        private readonly entityServices: EntityServiceContainer,
        private readonly httpClient: HttpClient,
    ) {}

    useSongs(): this {
        this.entityServices.for(SongDtoBlueprint).addSource({
            where: { albumId: { $inArray: true, $optional: true }, artistId: { $inArray: true, $optional: true } },
            select: { album: true, artist: true },
            load: ({ criteria: { albumId, artistId }, selection: { album, artist } }) => {
                // [todo] it is hard to understand which values "album" and "artist" can be
                // [todo] selection values are inconvenient
                // [todo] entity-space should accept observables
                return lastValueFrom(
                    this.httpClient.get<SongDto[]>("api/songs", {
                        params: toQueryParams({
                            album: album ? true : undefined,
                            artist: artist ? true : undefined,
                            albumId: albumId?.value,
                            artistId: artistId?.value,
                        }),
                    }),
                );
            },
        });

        return this;
    }
}
