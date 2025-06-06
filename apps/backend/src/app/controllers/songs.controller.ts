import { EntityWorkspace } from "@entity-space/common";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { SongCreatableDto, SongDto, SongDtoBlueprint, SongUpdatableDto } from "@unchaos/common";
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

    @Post()
    async createSong(@Body() song: SongCreatableDto): Promise<SongDto> {
        // [todo] validate entity
        return this.workspace.in(SongDtoBlueprint).createOne(song);
    }

    @Put()
    async updateSong(@Body() song: SongUpdatableDto): Promise<SongDto> {
        return this.workspace.in(SongDtoBlueprint).updateOne(song);
    }

    @Delete(":id")
    async deleteSong(@Param("id", ParseIntPipe) id: number): Promise<void> {
        const song = await this.workspace.from(SongDtoBlueprint).where({ id }).getOne();
        await this.workspace.in(SongDtoBlueprint).deleteOne(song);
    }
}
