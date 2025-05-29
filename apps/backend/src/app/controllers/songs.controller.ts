import { EntityWorkspace } from "@entity-space/common";
import { Controller, Get, Query } from "@nestjs/common";
import { SongDto, SongDtoBlueprint } from "@unchaos/common";
import { ParseIntsPipe, ParseOptionalTruePipe } from "../pipes";

@Controller("songs")
export class SongsController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getSongs(
        @Query("artist", ParseOptionalTruePipe) artist?: true,
        @Query("album", ParseOptionalTruePipe) album?: true,
        @Query("albumId", new ParseIntsPipe({ optional: true })) albumId?: number[],
        @Query("artistId", new ParseIntsPipe({ optional: true })) artistId?: number[],
    ): Promise<SongDto[]> {
        return this.workspace.from(SongDtoBlueprint).where({ albumId, artistId }).select({ artist, album }).get();
    }
}
