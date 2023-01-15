# Simple CRUD API server

## Install the application

Clone from the repository

```bash
git clone git@github.com:olegeremenko/simple-crud-server.git
```

Checkout to develop branch

```bash
git checkout develop
```

Setup dependencies with

```bash
npm ci
```

Copy `.env.example` to `.env` and update the port value if needed

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

   This command will build the application using `webpack` to the `dist/index.js` file and run it.


3. Multi-node mode with load balancer:

    ```bash
    npm run start:multi
    ```

    This command will create master process and number of workers according to host machine cpu cores.

    Master node will start on `SERVER_PORT` from `.env` and workers will start on `SERVER_PORT + worker_id` port.

    Master process load balances requests between workers using `Round Robin` algorithm.

## Test the application

```bash
npm run test
```

This command will run the application tests using `jest` package: unit and functional tests will be executed in a single-node environment.
