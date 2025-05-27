import { Injectable } from "@nestjs/common";
import { UserDto } from "@unchaos/common";
import { AsyncStoreService } from "../services/async-store.service";
import { EntityRepository } from "./entity-repository";

@Injectable()
export class UserRepository extends EntityRepository<"users"> {
    constructor(private readonly asyncStoreService: AsyncStoreService) {
        super("users");
    }

    async getById(ids: number[]): Promise<UserDto[]> {
        const users = await this.getAll();
        return users.filter(artist => ids.includes(artist.id));
    }
}
