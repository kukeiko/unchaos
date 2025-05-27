import { Injectable } from "@nestjs/common";
import { SongDto } from "@unchaos/common";
import { AsyncStoreService } from "../services/async-store.service";
import { EntityRepository } from "./entity-repository";

@Injectable()
export class SongRepository extends EntityRepository<"songs"> {
    constructor(private readonly asyncStoreService: AsyncStoreService) {
        super("songs");
    }

    async getById(ids: number[]): Promise<SongDto[]> {
        const songs = await this.getAll();
        return songs.filter(song => ids.includes(song.id));
    }

    async getByArtistId(artistIds: number[]): Promise<SongDto[]> {
        const songs = await this.getAll();
        return songs.filter(song => artistIds.includes(song.artistId));
    }
}
