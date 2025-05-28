import { EntityWorkspace } from "@entity-space/common";
import { Controller, Get, ParseBoolPipe, Query } from "@nestjs/common";
import { SongDto, SongDtoBlueprint } from "@unchaos/common";
import { ParseIntsPipe } from "../pipes/parse-ints.pipe";

@Controller("songs")
export class SongsController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getSongs(
        @Query("artist", new ParseBoolPipe({ optional: true })) artist?: boolean,
        @Query("album", new ParseBoolPipe({ optional: true })) album?: boolean,
        @Query("albumId", new ParseIntsPipe({ optional: true })) albumId?: number[],
        @Query("artistId", new ParseIntsPipe({ optional: true })) artistId?: number[],
    ): Promise<SongDto[]> {
        return this.workspace
            .from(SongDtoBlueprint)
            .where({ albumId, artistId })
            .select({ artist: artist || undefined, album: album || undefined })
            .get();
    }
}
