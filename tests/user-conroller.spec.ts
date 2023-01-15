import { validate as validateUuid } from 'uuid';
import { constants as httpConstants } from 'node:http2';
import UserDto from "../src/user/user-dto";
import { userRepository } from "../src/user/user-repository";
import { describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import HttpServer from "../src/server";
import initRouting from "../src/routing";
import { User } from '../src/user/user-entity';
import { v4 as uuidv4 } from 'uuid';

initRouting();

const server = new HttpServer();
const serverTest = supertest(server.getServer());

const testUserDto: UserDto = {
    username: 'John',
    age: 20,
    hobbies: ['hiking', 'reading'],
};

describe('Scenario 1 - parameters validation', () => {
    it('returns 400 when username is missing', async () => {
        const userDto = {
            age: 10,
            hobbies: ['reading'],
        };

        const response = await serverTest.post('/api/users').send(userDto);

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body.result).toEqual({
            message: "Username should not be empty",
        });
    });

    it('returns 400 when age is missing', async () => {
        const userDto = {
            username: 'Test',
            hobbies: ['reading'],
        };

        const response = await serverTest.post('/api/users').send(userDto);

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body.result).toEqual({
            message: "Age should be a valid numeric",
        });
    });

    it('returns 400 when hobbies are missing', async () => {
        const userDto = {
            username: 'Test',
            age: 10,
        };

        const response = await serverTest.post('/api/users').send(userDto);

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body.result).toEqual({
            message: "Hobbies should be an array",
        });
    });

    it('returns 400 when request has invalid json', async () => {
        const response = await serverTest.post('/api/users').send('invalid json');

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body.result).toEqual({
            message: 'Invalid JSON'
        });
    });
});

describe('Scenario 2 - read non-existing entities', () => {

    let randomUserId = uuidv4();

    it('returns empty array when no users created', async () => {
        const response = await serverTest.get('/api/users');
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_OK);
        expect(result).toEqual([]);
    });

    it('returns 404 on get user when user does not exist', async () => {
        const response = await serverTest.get(`/api/users/${randomUserId}`);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
        expect(result.message).toEqual(`User with ID ${randomUserId} not found`);
    });

    it('returns 404 on user update when user does not exist', async () => {
        const response = await serverTest.put(`/api/users/${randomUserId}`).send(testUserDto);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
        expect(result.message).toEqual(`User with ID ${randomUserId} not found`);
    });

    it('returns 404 on user delete when user does not exist', async () => {
        const response = await serverTest.delete(`/api/users/${randomUserId}`);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_NOT_FOUND);
        expect(result.message).toEqual(`User with ID ${randomUserId} not found`);
    });

});

describe('Scenario 3 - create, edit and delete user entity', () => {
    const updateUserDto: UserDto = {
        username: 'Mike',
        age: 30,
        hobbies: ['working'],
    };

    let userId: string;

    it('creates a new user', async () => {
        const userDto: UserDto = testUserDto;

        const response = await serverTest.post('/api/users').send(testUserDto);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
        expect(validateUuid(result.id)).toBeTruthy();
        expect(result.username).toEqual(userDto.username);
        expect(result.age).toEqual(userDto.age);
        expect(result.hobbies).toEqual(userDto.hobbies);

        const allUsers = await userRepository.findAll();
        expect(allUsers.length).toEqual(1);
    });

    it('gets users list', async () => {
        const response = await serverTest.get('/api/users');
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_OK);
        const user: User = result[0];
        expect(validateUuid(user.id)).toBeTruthy();

        expect(user.username).toEqual(testUserDto.username);
        expect(user.age).toEqual(testUserDto.age);
        expect(user.hobbies).toEqual(testUserDto.hobbies);
    });

    it('creates another user', async () => {
        const userDto: UserDto = testUserDto;

        const response = await serverTest.post('/api/users').send(testUserDto);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
        expect(validateUuid(result.id)).toBeTruthy();
        expect(result.username).toEqual(userDto.username);
        expect(result.age).toEqual(userDto.age);
        expect(result.hobbies).toEqual(userDto.hobbies);

        userId = result.id;
    });

    it('gets user', async () => {
        const response = await serverTest.get(`/api/users/${userId}`);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_OK);
        const user: User = result;

        expect(user.username).toEqual(testUserDto.username);
        expect(user.age).toEqual(testUserDto.age);
        expect(user.hobbies).toEqual(testUserDto.hobbies);
    });

    it('updates user', async () => {
        const response = await serverTest.put(`/api/users/${userId}`).send(updateUserDto);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_OK);
        const user: User = result;

        expect(user.username).toEqual(updateUserDto.username);
        expect(user.age).toEqual(updateUserDto.age);
        expect(user.hobbies).toEqual(updateUserDto.hobbies);
    });

    it('deletes user', async () => {
        const response = await serverTest.delete(`/api/users/${userId}`);
        expect(response.status).toBe(httpConstants.HTTP_STATUS_NO_CONTENT);
    });
});
