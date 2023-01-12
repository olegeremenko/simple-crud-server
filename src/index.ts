import * as dotenv from 'dotenv';
import ErrorHandler from './errors/error-handler';
import buildSingleNodeServer from './app-builders/single-node-server-builder';
import parseArgs from "./args-parser";
import buildMultiNodeServer from './app-builders/multi-node-server-builder';

dotenv.config();

const port: number = Number(process.env['SERVER_PORT']);

process.on('unhandledRejection', (reason) => {
    // The error will be handled by the 'uncaughtException' handler.
    throw reason;
});

process.on('uncaughtException', (error) => {
    ErrorHandler.handle(error);
});

const args = parseArgs();
const multiNode = args['multi-node'] ?? false;

if (multiNode) {
    buildMultiNodeServer(port);
} else {
    buildSingleNodeServer(port);
}

