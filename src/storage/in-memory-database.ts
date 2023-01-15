import { IDataStorage } from "./data-storage";

class InMemoryDatabase<T> implements IDataStorage<T> {
    private items: T[] = [];

    private getIndex(key: keyof T, value: any): number {
        return this.items.findIndex((item) => item[key] === value);
    }

    public async get(key: keyof T, value: any): Promise<any> {
        return this.items.find((item) => item[key] === value);
    }

    public async add(item: T): Promise<void> {
        this.items.push(item);
    }

    public async update(key: keyof T, value: any, updatedItem: T): Promise<T> {
        const itemIndex = this.getIndex(key, value);

        if (itemIndex !== -1) {
            this.items[itemIndex] = updatedItem;
        }

        return updatedItem;
    }

    public async remove(key: keyof T, value: any): Promise<boolean> {
        const itemIndex = this.getIndex(key, value);

        if (itemIndex === -1) {
            return false;
        }

        this.items.splice(itemIndex, 1);

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
