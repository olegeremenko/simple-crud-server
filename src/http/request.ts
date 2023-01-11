import { IncomingMessage } from 'node:http';
import HttpMethod from './methods';
import ArgumentValidateError from "../errors/argument-validate-error";

class Request extends IncomingMessage {
    private body: string | undefined;

    private getUrlParts(): any[] {
        if (!this.url) {
            return [];
        }

        let urlString: string = this.url;

        if (urlString.endsWith('/')) {
            urlString = urlString.slice(0, urlString.length - 1);
        }

        if (urlString.startsWith('/')) {
            urlString = urlString.slice(1);
        }

        let urlParts: any[] = [];

        const requestParts = urlString.toLowerCase().split('/');

        if (requestParts.length > 1 && requestParts[0] == 'api') {
            urlParts = requestParts.splice(1);
        }

        return urlParts;
    }

    public getMethod(): HttpMethod {
        switch (this.method) {
            case 'POST':
                return HttpMethod.POST;
            case 'DELETE':
                return HttpMethod.DELETE;
            case 'PUT':
                return HttpMethod.PUT;
            default:
                return HttpMethod.GET;
        }
    }

    public getAction(): string {
        const urlParts = this.getUrlParts();

        return urlParts.length > 0 ? urlParts[0] : '';
    }

    public getId(): string | undefined {
        const urlParts = this.getUrlParts();

        return urlParts[1];
    }

    public getUrl(): string {
        return this.url ? this.url.toLowerCase() : '';
    }

    public getBody(): string | undefined {
        return this.body;
    }

    public setBody(body: string | undefined): void {
        this.body = body;
    }

    public getJsonBody() {
        try {
            if (this.body) {
                return JSON.parse(this.body);
            }
        } catch (error) {
        }

        throw new ArgumentValidateError('Invalid JSON');
    }
}

export default Request;
