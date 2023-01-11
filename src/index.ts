import * as dotenv from 'dotenv';
import ErrorHandler from './errors/error-handler';
import { buildSingleNodeServer } from './server-builder';

dotenv.config();

const port: number = Number(process.env['SERVER_PORT']);

process.on('unhandledRejection', (reason) => {
    // The error will be handled by the 'uncaughtException' handler.
    throw reason;
});

process.on('uncaughtException', (error) => {
    ErrorHandler.handle(error);
});

buildSingleNodeServer().listen(port);

