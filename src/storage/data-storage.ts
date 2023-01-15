interface IDataStorage<T> {
    get(key: keyof T, value: any): Promise<T | undefined>;
    add(item: T): Promise<void>;
    update(key: keyof T, value: any, item: T): Promise<T>;
    remove(key: keyof T, value: any): Promise<boolean>;
    clear(): Promise<void>;
    getAll(): Promise<T[]>;
}

export { IDataStorage };
