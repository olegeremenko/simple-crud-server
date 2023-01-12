import HttpServer from "../server";
import initRouting from "../routing";

initRouting();

const buildSingleNodeServer = (port: number): HttpServer => {
    const server = new HttpServer();
    server.listen(port);

    return server;
}

export default buildSingleNodeServer;
