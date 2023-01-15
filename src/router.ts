import ActionHandler from "./action-handler";
import HttpMethod from "./http/methods";
import Request from "./http/request";

interface IRoutes {
    [index: string]: ActionHandler;
}

class Router {
    private static routes: IRoutes = {};

    private static getRoutePath(method: HttpMethod, action: string, id: string | undefined): string {

        let routePath = `${method}_${action}`;

        if (id) {
            routePath += '_id';
        }

        return routePath;
    }

    public static add(method: HttpMethod, path: string, handler: ActionHandler) {
        const routeParts = path.trim().split('/');

        if (routeParts[1] == undefined || routeParts[2] == undefined) {
            return;
        }

        const route = this.getRoutePath(method, routeParts[2], routeParts[3]);
        this.routes[route] = handler;
    }

    public static resolve(request: Request): ActionHandler | null {
        const route = this.getRoutePath(request.getMethod(), request.getAction(), request.getId());

        return this.routes[route] ?? null;
    }
}

export default Router;
