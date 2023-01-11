import * as dotenv from 'dotenv';
import HttpServer from './server';
import HttpMethod from './http/methods';
import userController from './user/user-controller';
import ErrorHandler from './errors/error-handler';
import Router from './router';

dotenv.config();

const port: number = Number(process.env['SERVER_PORT']);

process.on('unhandledRejection', (reason) => {
    // The error will be handled by the 'uncaughtException' handler.
    throw reason;
});

process.on('uncaughtException', (error) => {
    ErrorHandler.handle(error);
});

Router.add(HttpMethod.GET, '/api/users', userController.list);
Router.add(HttpMethod.POST, '/api/users', userController.create);
Router.add(HttpMethod.GET, '/api/users/{id}', userController.getById);
Router.add(HttpMethod.PUT, '/api/users/{id}', userController.update);
Router.add(HttpMethod.DELETE, '/api/users/{id}', userController.delete);

const server = new HttpServer();
server.listen(port);

// if (isMultiNode) {
    // createMultiNodeApplication(port);
// } else {
    // createApplication().listen(port);
// }
