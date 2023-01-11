import { IDataStorage } from "./data-storage";

class InMemoryDatabase<T> implements IDataStorage<T> {
    private items: T[] = [];

    public async get(key: keyof T, value: any): Promise<any> {
        return this.items.find((item) => item[key] === value);
    }

    public async add(item: T): Promise<void> {
        this.items.push(item);
    }

    public async update(key: keyof T, value: any, updatedItem: T): Promise<T> {
        this.items = this.items.map((item: T): T => {
            if (item[key] === value) {
                return updatedItem;
            }

            return item;
        });

        return updatedItem;
    }

    public async remove(key: keyof T, value: any): Promise<boolean> {
        const item = await this.get(key, value);

        if (!item) {
            return false;
        }

        this.items = this.items.filter((item: T) => item[key] !== value);

        return true;
    }

    public async clear(): Promise<void> {
        this.items = [];
    }

    public async getAll(): Promise<T[]> {
        return this.items;
    }
}

export { InMemoryDatabase };
