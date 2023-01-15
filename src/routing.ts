import Router from "./router";
import HttpMethod from "./http/methods";
import userController from "./user/user-controller";

const initRouting = () => {
    Router.add(HttpMethod.GET, '/api/users', userController.list);
    Router.add(HttpMethod.POST, '/api/users', userController.create);
    Router.add(HttpMethod.GET, '/api/users/{id}', userController.getById);
    Router.add(HttpMethod.PUT, '/api/users/{id}', userController.update);
    Router.add(HttpMethod.DELETE, '/api/users/{id}', userController.delete);
}

export default initRouting;
