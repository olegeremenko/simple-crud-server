# Simple CRUD API server

## Install the application

Clone from the repository and run

```bash
npm ci
```

Copy `.env.example` to `.env` and update the port value if needed.

## Run the application

1. Development mode:

   ```bash
   npm run start:dev
   ```

   This command will run the application in development mode with `nodemon` and `ts-node` packages on a port from `.env`.


2. Production mode:

   ```bash
   npm run start:prod
   ```

   This command will build the application using `webpack` to the `build/bundle.js` file and run it.


3. Multi-node `Cluster` environment:

    ```bash
    npm run start:multi
    ```

    This command will create 1 master process and `N` workers in a cluster, where `N` is the number of logical CPU cores.

    Master node will start on `API_PORT` from `.env` file and workers will start on `API_PORT + %worker_index%` port.

    Workers will use the in-memory database, located in master process.

    Master process load balances requests between workers using `Round Robin` algorithm.

    By default, load balancer will run on `http://localhost:4000/api/users`.

## Test the application

```bash
npm run test
```

This command will run the application tests using `jest` package: unit and functional tests will be executed in a single-node environment.

