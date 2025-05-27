import { EntityWorkspace } from "@entity-space/common";
import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ArtistCreatableDto, ArtistDto, ArtistDtoBlueprint } from "@unchaos/common";

@Controller("artists")
export class ArtistsController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getArtists(): Promise<ArtistDto[]> {
        return this.workspace.from(ArtistDtoBlueprint).get();
    }

    @Get(":id")
    getArtistById(
        @Param("id", ParseIntPipe) id: number,
        @Query("withUsers", new ParseBoolPipe({ optional: true })) withUsers?: boolean,
    ): Promise<ArtistDto> {
        // [todo] throw 404 instead: add ability to entity-space to customize thrown errors
        // or add an interceptor that can identify the "NotFound" error and map it
        return this.workspace
            .from(ArtistDtoBlueprint)
            .where({ id })
            .select({ metadata: { createdBy: withUsers || undefined } })
            .getOne();
    }

    @Post()
    async createArtist(@Body() artist: ArtistCreatableDto): Promise<ArtistDto> {
        return this.workspace.in(ArtistDtoBlueprint).create(artist);
    }
}
