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
    async getArtistById(
        @Param("id", ParseIntPipe) id: number,
        @Query("users", new ParseBoolPipe({ optional: true })) users?: boolean,
        @Query("songs", new ParseBoolPipe({ optional: true })) songs?: boolean,
    ): Promise<ArtistDto> {
        // [todo] throw 404 instead: add ability to entity-space to customize thrown errors
        // or add an interceptor that can identify the "NotFound" error and map it
        const artist = await this.workspace
            .from(ArtistDtoBlueprint)
            .where({ id })
            .select({ songs: songs ? true : undefined })
            .getOne();

        if (users) {
            await this.workspace
                .for(ArtistDtoBlueprint)
                .select({
                    metadata: { createdBy: true },
                    songs: { metadata: { createdBy: true } },
                })
                .cache(true)
                .hydrateOne(artist);
        }

        return artist;
    }

    @Post()
    async createArtist(@Body() artist: ArtistCreatableDto): Promise<ArtistDto> {
        return this.workspace.in(ArtistDtoBlueprint).create(artist);
    }
}
