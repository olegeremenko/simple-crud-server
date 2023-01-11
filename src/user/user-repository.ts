import cluster from 'node:cluster';
import { IDataStorage } from '../storage/data-storage';
import { InMemoryDatabase } from '../storage/in-memory-database';
import UserDto from './user-dto';
import { User } from './user-entity';

class UserRepository {
    private dataStorage: IDataStorage<User>;

    constructor(dataStorage: IDataStorage<User>) {
        this.dataStorage = dataStorage;
    }

    public async findAll(): Promise<User[]> {
        return await this.dataStorage.getAll();
    }

    public async findById(id: string): Promise<User | undefined> {
        return await this.dataStorage.get('id', id);
    }

    public async create(user: User): Promise<User> {
        await this.dataStorage.add(user);

        return user;
    }

    public async update(id: string, userDto: UserDto): Promise<User> {
        const user = new User(userDto.username, userDto.age, userDto.hobbies, id);
        const result = await this.dataStorage.update('id', id, user);
        return result;
    }

    public async delete(id: string): Promise<boolean> {
        return await this.dataStorage.remove('id', id);
    }

    public async clearAll(): Promise<void> {
        await this.dataStorage.clear();
    }
}

// const dataStorage = cluster.isWorker ? new MasterProcessDatabase() : new InMemoryDatabase<User>();

const dataStorage = new InMemoryDatabase<User>();
const userRepository = new UserRepository(dataStorage);

export { userRepository, UserRepository };
