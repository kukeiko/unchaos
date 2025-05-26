import { EntityServiceContainer, EntityWorkspace } from "@entity-space/common";
import { Controller, Get } from "@nestjs/common";
import { ArtistDto, ArtistDtoBlueprint, common } from "@unchaos/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getData() {
        return this.appService.getData();
    }

    @Get("common")
    getCommon() {
        return { foo: common() };
    }

    @Get("artists")
    getArtists(): Promise<ArtistDto[]> {
        const services = new EntityServiceContainer();
        const workspace = new EntityWorkspace(services);

        services.for(ArtistDtoBlueprint).addSource({
            load: () => [
                { id: 1, name: "foo" },
                { id: 2, name: "bar" },
                { id: 3, name: "baz" },
            ],
        });

        return workspace.from(ArtistDtoBlueprint).get();
    }
}
