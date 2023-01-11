import ActionHandler from "./action-handler";
import Request from "./http/request";
import RouteResolveError from "./errors/route-resolve-error";
import Router from "./router";

class ActionResolver {
    static async resolve(request: Request): Promise<ActionHandler> {
        const actionHandler = Router.resolve(request);

        if (!actionHandler) {
            throw new RouteResolveError(`A route can not be resolved ("${request.getUrl()}").`);
        }

        return actionHandler;
    }
}

export default ActionResolver;