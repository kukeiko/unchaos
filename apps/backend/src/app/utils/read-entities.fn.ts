import { Entities } from "../models/entities.interface";
import { readJson } from "./read-json.fn";

export async function readEntities<K extends keyof Entities>(type: K): Promise<Entities[K]> {
    const all = await readJson<Entities>("entities.json");
    return all[type];
}
