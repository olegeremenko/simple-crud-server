import { constants as httpConstants } from 'node:http2';
import HttpNotFoundError from '../errors/http-not-found-error';
import ActionResult from '../action-result';
import Request from '../http/request';
import assertIsNumeric from '../validators/is-numeric';
import assertIsValidUuid from '../validators/is-uuid';
import assertNotNull from '../validators/not-null';
import assertIsArray from '../validators/is-array';
import { User } from './user-entity';
import { userRepository } from './user-repository';

class UserController {
    public async list(request: Request): Promise<ActionResult> {
        const users = await userRepository.findAll();
        
        return {
            httpStatusCode: httpConstants.HTTP_STATUS_OK,
            actionResult: users,
        };
    }

    public async getById(request: Request): Promise<ActionResult> {
        const userId = request.getId();

        assertIsValidUuid(userId);

        const user = await userRepository.findById(userId);

        if (!user) {
            throw new HttpNotFoundError(`User with ID ${userId} not found`);
        }

        return {
            httpStatusCode: httpConstants.HTTP_STATUS_OK,
            actionResult: user,
        };
    }

    public async create(request: Request): Promise<ActionResult> {
        const userDto = request.getJsonBody();

        assertNotNull(userDto.username, 'Username should not be empty');
        assertIsNumeric(userDto.age, 'Age should be a valid numeric');
        assertIsArray(userDto.hobbies, 'Hobbies should be an array');
        
        const createdUser = await userRepository.create(User.fromDto(userDto));

        return {
            httpStatusCode: httpConstants.HTTP_STATUS_CREATED,
            actionResult: createdUser,
        };
    }

    public async update(request: Request): Promise<ActionResult> {
        const userId = request.getId();
        const userDto = request.getJsonBody();

        assertIsValidUuid(userId);
        assertNotNull(userDto.username, 'Username should not be empty');
        assertIsNumeric(userDto.age, 'Age should be a valid numeric');
        assertIsArray(userDto.hobbies, 'Hobbies should be an array');
        
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new HttpNotFoundError(`User with ID ${userId} not found`);
        }

        const updatedUser = await userRepository.update(userId, User.fromDto(userDto));

        return {
            httpStatusCode: httpConstants.HTTP_STATUS_OK,
            actionResult: updatedUser,
        };
    }

    public async delete(request: Request): Promise<ActionResult> {
        const userId = request.getId();

        assertIsValidUuid(userId);

        const deleted = await userRepository.delete(userId);

        if (!deleted) {
            throw new HttpNotFoundError(`User with ID ${userId} not found`);
        }

        return {
            httpStatusCode: httpConstants.HTTP_STATUS_NO_CONTENT,
            actionResult: null,
        };
    }
}

const userController = new UserController();

export default userController;
