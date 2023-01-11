import { validate as validateUuid } from 'uuid';
import { constants as httpConstants } from 'node:http2';
import UserDto from "../src/user/user-dto";
import { userRepository } from "../src/user/user-repository";
import { beforeEach, describe, expect, it } from "@jest/globals";
import * as supertest from "supertest";
import { buildSingleNodeServer } from '../src/server-builder';

const server = buildSingleNodeServer();
const serverTest = supertest(server.getServer());

beforeEach(() => {
    userRepository.clearAll();
});

describe('POST /users', () => {
    it('creates a new user', async () => {
        const userDto: UserDto = {
            username: 'John',
            age: 20,
            hobbies: ['hiking', 'reading'],
        };

        const response = await serverTest.post('/api/users').send(userDto);
        const result = response.body.result;

        expect(response.status).toBe(httpConstants.HTTP_STATUS_CREATED);
        expect(validateUuid(result.id)).toBeTruthy();
        expect(result.username).toEqual(userDto.username);
        expect(result.age).toEqual(userDto.age);
        expect(result.hobbies).toEqual(userDto.hobbies);

        const allUsers = await userRepository.findAll();
        expect(allUsers.length).toEqual(1);
    });

    it('returns 400 when username is missing', async () => {
        const userDto = {
            age: 10,
            hobbies: ['reading'],
        };

        const response = await serverTest.post('/api/users').send(userDto);

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        const allUsers = await userRepository.findAll();
        expect(allUsers.length).toEqual(0);
        expect(response.body.result).toEqual({
            message: "Username should not be empty",
        });
    });

    it('returns 400 when request has invalid json', async () => {
        const response = await serverTest.post('/api/users').send('invalid json');

        expect(response.status).toBe(httpConstants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body).toEqual({
            message: 'Invalid JSON'
        });
    });
});
