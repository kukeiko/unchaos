import { EntityWorkspace } from "@entity-space/common";
import { Controller, Get } from "@nestjs/common";
import { SongDto, SongDtoBlueprint } from "@unchaos/common";

@Controller("songs")
export class SongsController {
    constructor(private readonly workspace: EntityWorkspace) {}

    @Get()
    getSongs(): Promise<SongDto[]> {
        return this.workspace.from(SongDtoBlueprint).select({ artist: true }).get();
    }
}
