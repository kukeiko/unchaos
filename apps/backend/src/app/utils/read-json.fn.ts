import { readFile } from "node:fs/promises";

export async function readJson<T = unknown>(path: string): Promise<T> {
    try {
        const data = await readFile(path, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        throw error;
    }
}
