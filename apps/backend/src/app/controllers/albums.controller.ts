import { EntityWorkspace } from "@entity-space/common";
import { Controller, Get } from "@nestjs/common";
import { AlbumDto, AlbumDtoBlueprint } from "@unchaos/common";

@Controller("albums")
export class AlbumsController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getAlbums(): Promise<AlbumDto[]> {
        return this.workspace.from(AlbumDtoBlueprint).get();
    }
}
