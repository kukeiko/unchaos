import { writeFile } from "node:fs/promises";

export async function writeJson(path: string, value: any): Promise<void> {
    try {
        const data = JSON.stringify(value, null, 4);
        await writeFile(path, data, "utf8");
    } catch (error) {
        console.error("Error writing JSON file:", error);
        throw error;
    }
}
