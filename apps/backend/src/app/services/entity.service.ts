import { EntityServiceContainer } from "@entity-space/common";
import { Injectable } from "@nestjs/common";
import { ArtistDtoBlueprint, UserDtoBlueprint } from "@unchaos/common";
import { ArtistRepository } from "../repositories/artist.repository";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class EntityService {
    constructor(
        private readonly services: EntityServiceContainer,
        private readonly artistRepository: ArtistRepository,
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
