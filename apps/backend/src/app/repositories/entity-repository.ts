import { Entities } from "../models/entities.interface";
import { readEntities } from "../utils/read-entities.fn";

export abstract class EntityRepository<K extends keyof Entities> {
    constructor(protected readonly key: K) {}

    async getAll(): Promise<Entities[K]> {
        return readEntities(this.key);
    }
}
