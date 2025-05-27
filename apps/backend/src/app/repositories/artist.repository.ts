import { Injectable } from "@nestjs/common";
import { ArtistCreatableDto, ArtistDto } from "@unchaos/common";
import { AsyncStoreService } from "../services/async-store.service";
import { writeEntities } from "../utils/write-entities.fn";
import { EntityRepository } from "./entity-repository";

@Injectable()
export class ArtistRepository extends EntityRepository<"artists"> {
    constructor(private readonly asyncStoreService: AsyncStoreService) {
        super("artists");
    }

    async getById(ids: number[]): Promise<ArtistDto[]> {
        const artists = await this.getAll();
        return artists.filter(artist => ids.includes(artist.id));
    }

    async create(artist: ArtistCreatableDto): Promise<ArtistDto> {
        const artists = await this.getAll();
        const latest = artists.sort((a, b) => b.id - a.id)[0];
        const nextId = (latest?.id ?? 0) + 1;
        const created: ArtistDto = {
            id: nextId,
            name: artist.name,
            metadata: { createdAt: new Date().toISOString(), createdById: this.asyncStoreService.getUserId() },
        };
        artists.push(created);
        writeEntities("artists", artists);

        return created;
    }
}
