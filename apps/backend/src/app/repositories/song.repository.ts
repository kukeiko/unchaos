import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SongCreatableDto, SongDto, SongUpdatableDto } from "@unchaos/common";
import { AsyncStoreService } from "../services/async-store.service";
import { writeEntities } from "../utils/write-entities.fn";
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

    async create(song: SongCreatableDto): Promise<SongDto> {
        const songs = await this.getAll();
        const latest = songs.sort((a, b) => b.id - a.id)[0];
        const nextId = (latest?.id ?? 0) + 1;
        const created: SongDto = {
            id: nextId,
            name: song.name,
            albumId: song.albumId,
            artistId: song.artistId,
            metadata: { createdAt: new Date().toISOString(), createdById: this.asyncStoreService.getUserId() },
        };
        songs.push(created);
        writeEntities("songs", songs);

        return created;
    }

    async update(song: SongUpdatableDto): Promise<SongDto> {
        const all = await this.getAll();
        const index = all.findIndex(candidate => candidate.id === song.id);

        if (index < 0) {
            throw new HttpException(`song #${song.id} not found`, HttpStatus.BAD_REQUEST);
        }

        // [todo] cast
        const updated = { ...all[index], ...song } as SongDto;
        updated.metadata.updatedById = this.asyncStoreService.getUserId();
        updated.metadata.updatedAt = new Date().toISOString();
        all[index] = updated;
        writeEntities("songs", all);

        return updated;
    }

    async delete(song: SongDto): Promise<void> {
        const all = await this.getAll();
        const index = all.findIndex(candidate => candidate.id === song.id);
        all.splice(index, 1);
        writeEntities("songs", all);
    }
}
