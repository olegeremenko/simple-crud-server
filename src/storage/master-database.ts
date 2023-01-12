import {IDataStorage} from "./data-storage";
import {User} from "../user/user-entity";
import cluster from "node:cluster";

class MasterProcessDatabase implements IDataStorage<User> {
    public async get(_: keyof User, value: any): Promise<User | undefined> {
        const userObject = await this.sendCommandToMasterProcess('findById', [value]);
        const result = userObject ? User.fromDto(userObject) : undefined;

        return await Promise.resolve(result);
    }

    public async add(item: User): Promise<void> {
        await this.sendCommandToMasterProcess('create', [item]);
    }

    public async update(_: keyof User, value: any, item: User): Promise<User> {
        return await this.sendCommandToMasterProcess('update', [value, item]);
    }

    public async remove(_: keyof User, value: any): Promise<boolean> {
        return await this.sendCommandToMasterProcess('delete', [value]);
    }

    public async clear(): Promise<void> {
        return await this.sendCommandToMasterProcess('clearAll');
    }

    public async getAll(): Promise<User[]> {
        return await this.sendCommandToMasterProcess('findAll');
    }

    private async sendCommandToMasterProcess(method: string, parameters: any[] = []): Promise<any> {
        return await new Promise((resolve, reject) => {
            process.send!({ method, parameters });

            cluster.worker!.once('message', (msg) => {
                if (msg.method === method) {
                    resolve(msg.data);
                } else {
                    reject(msg);
                }
            });
        });
    }
}

export default MasterProcessDatabase;
