import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

enum AsyncStorageKeys {
    UserId = "user-id",
}

@Injectable()
export class AsyncStoreService {
    private readonly storage = new AsyncLocalStorage<Map<string, any>>();

    run(callback: (...args: any[]) => void, initialData: Record<string, any> = {}): void {
        this.storage.run(new Map(Object.entries(initialData)), callback);
    }

    set<T = any>(key: string, value: T): void {
        const store = this.storage.getStore();
        store?.set(key, value);
    }

    get<T = any>(key: string): T {
        const store = this.storage.getStore();

        if (!store?.has(key)) {
            throw new Error(`${key} not found in AsyncStore`);
        }

        return store!.get(key)!;
    }

    setUserId(id: number): void {
        this.set(AsyncStorageKeys.UserId, id);
    }

    getUserId(): number {
        return this.get(AsyncStorageKeys.UserId);
    }
}
