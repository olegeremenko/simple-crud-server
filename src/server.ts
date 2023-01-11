import http from 'node:http';
import ActionResolver from './action-resolver';
import ActionResult from './action-result';
import Request from './http/request';
import Response from './http/response';
import { constants as httpConstants } from 'node:http2';
import RouteResolveError from './errors/route-resolve-error';
import ArgumentValidateError from './errors/argument-validate-error';
import HttpNotFoundError from './errors/http-not-found-error';

class HttpServer {
    private server: ReturnType<typeof http.createServer>;

    constructor() {
        this.server = http.createServer({
            IncomingMessage: Request,
            ServerResponse: Response,
        }, async (request: Request, response: Response) => {
            try {
                const body = await this.resolveBody(request);
                request.setBody(body);

                const controllerAction = await ActionResolver.resolve(request);
                const actionResult = await controllerAction(request);

                this.prepareAndSendRequest(actionResult, response);
            } catch (error) {
                if (error instanceof RouteResolveError) {
                    this.prepareAndSendRequest({ 
                        httpStatusCode: httpConstants.HTTP_STATUS_NOT_FOUND,
                        actionResult: { message: error.message }
                    }, response);
                } else if (error instanceof ArgumentValidateError) {
                    this.prepareAndSendRequest({ 
                        httpStatusCode: httpConstants.HTTP_STATUS_BAD_REQUEST,
                        actionResult: { message: error.message }
                    }, response);
                } else if (error instanceof HttpNotFoundError) {
                    this.prepareAndSendRequest({ 
                        httpStatusCode: httpConstants.HTTP_STATUS_NOT_FOUND,
                        actionResult: { message: error.message }
                    }, response);
                } else {
                    this.prepareAndSendRequest({ 
                        httpStatusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                        actionResult: { message: 'Internal Server Error' }
                    }, response);
                    throw error;
                }
            }
        });
    }

    public listen(port: number): void {
        this.server.listen(port);
    }

    private prepareAndSendRequest(actionResult: ActionResult, response: Response): void {
        response.json({
            result: actionResult.actionResult
        }, actionResult.httpStatusCode);
    }

    private resolveBody = async (request: Request): Promise<string> => {
        const bodyChunks: Uint8Array[] = [];

        for await (const chunk of request) {
            bodyChunks.push(chunk);
        }

        const bodyAsString = Buffer.concat(bodyChunks).toString();

        return bodyAsString;
    };
}

export default HttpServer;
