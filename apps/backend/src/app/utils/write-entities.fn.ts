import { Entities } from "../models/entities.interface";
import { readJson } from "./read-json.fn";
import { writeJson } from "./write-json.fn";

export async function writeEntities<K extends keyof Entities>(type: K, entities: Entities[K]): Promise<void> {
    const all = await readJson<Entities>("entities.json");
    all[type] = entities.slice().sort((a, b) => a.id - b.id) as Entities[K];
    await writeJson("entities.json", all);
}
