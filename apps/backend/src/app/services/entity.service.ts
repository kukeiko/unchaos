import { EntityServiceContainer } from "@entity-space/common";
import { Injectable } from "@nestjs/common";
import { AlbumDtoBlueprint, ArtistDtoBlueprint, SongDtoBlueprint, UserDtoBlueprint } from "@unchaos/common";
import { AlbumRepository } from "../repositories/album.repository";
import { ArtistRepository } from "../repositories/artist.repository";
import { SongRepository } from "../repositories/song.repository";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class EntityService {
    constructor(
        private readonly services: EntityServiceContainer,
        private readonly artistRepository: ArtistRepository,
        private readonly albumRepository: AlbumRepository,
        private readonly songRepository: SongRepository,
        private readonly userRepository: UserRepository,
    ) {}

    useArtists(): this {
        this.services
            .for(ArtistDtoBlueprint)
            .addSource({
                where: { id: { $inArray: true } },
                load: ({ criteria: { id } }) => this.artistRepository.getById(id.value),
            })
            .addSource({ load: () => this.artistRepository.getAll() })
            .addCreateMutator({
                create: ({ entity }) => this.artistRepository.create(entity),
            });

        return this;
    }

    useAlbums(): this {
        this.services
            .for(AlbumDtoBlueprint)
            .addSource({
                where: { id: { $inArray: true } },
                load: ({ criteria: { id } }) => this.albumRepository.getById(id.value),
            })
            .addSource({ load: () => this.albumRepository.getAll() });

        return this;
    }

    useSongs(): this {
        this.services
            .for(SongDtoBlueprint)
            .addSource({
                where: { id: { $equals: true } },
                load: ({ criteria: { id } }) => this.songRepository.getById([id.value]),
            })
            .addSource({
                where: { artistId: { $equals: true } },
                load: ({ criteria: { artistId } }) => this.songRepository.getByArtistId([artistId.value]),
            })
            .addSource({ load: () => this.songRepository.getAll() });

        return this;
    }

    useUsers(): this {
        this.services
            .for(UserDtoBlueprint)
            .addSource({
                where: { id: { $inArray: true } },
                load: ({ criteria: { id } }) => this.userRepository.getById(id.value),
            })
            .addSource({
                load: () => this.userRepository.getAll(),
            });
        return this;
    }
}
