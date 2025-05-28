import { Injectable } from "@nestjs/common";
import { AlbumDto } from "@unchaos/common";
import { AsyncStoreService } from "../services/async-store.service";
import { EntityRepository } from "./entity-repository";

@Injectable()
export class AlbumRepository extends EntityRepository<"albums"> {
    constructor(private readonly asyncStoreService: AsyncStoreService) {
        super("albums");
    }

    async getById(ids: number[]): Promise<AlbumDto[]> {
        const albums = await this.getAll();
        return albums.filter(album => ids.includes(album.id));
    }
}
