import {cpus} from 'node:os';
import cluster from "node:cluster";
import * as http from "node:http";
import * as url from 'node:url';
import buildSingleNodeServer from "./single-node-server-builder";
import {userRepository} from "../user/user-repository";

const cpuCount = cpus().length;
let currentWorkerId = 0;

const getNextPort = (startPort: number): number => {
    currentWorkerId = currentWorkerId % cpuCount + 1;

    return startPort + currentWorkerId;
};

const enableMasterDatabaseCommunicationWithWorkers = (): void => {
    for (const id in cluster.workers) {
        const worker = cluster.workers[id]!;

        worker.on('message', async (msg) => {
            // @ts-ignore
            if (typeof userRepository[msg.method] === 'function') {
                const parameters = msg.parameters ?? [];
                // @ts-ignore
                const result = await userRepository[msg.method](...parameters);
                worker.send({ method: msg.method, data: result });
            }
        });
    }
};

const createLoadBalancerServer = (startPort: number): void => {
    http.createServer((balancerRequest, balancerResponse) => {
        const port = getNextPort(startPort);
        console.log(`Sending request to worker on port ${port}`);

        const options = {
             ...url.parse(balancerRequest.url ?? ''),
            port: port,
            headers: balancerRequest.headers,
            method: balancerRequest.method,
        };

        balancerRequest.pipe(
            http.request(options, (response) => {
                balancerResponse.writeHead(response.statusCode!, response.headers);
                response.pipe(balancerResponse);
            }),
        );
    }).listen(startPort);
};

const buildMultiNodeServer = (startPort: number): void => {
    if (cluster.isPrimary) {
        console.log(`Load Balancer [${process.pid}] is running on port ${startPort}`);

        for (let cpuIndex = 0; cpuIndex < cpuCount; cpuIndex ++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            console.log(`Worker [${worker.process.pid}] died`);
        });

        enableMasterDatabaseCommunicationWithWorkers();
        createLoadBalancerServer(startPort);
    } else {
        const workerPort = startPort + cluster.worker!.id;
        buildSingleNodeServer(workerPort);

        console.log(`Worker [${process.pid}] is running on port ${workerPort}`);
    }
};

export default buildMultiNodeServer;
