# eb-tokens-api

> A REST API for generating and validating Echobind Tokens.

## What are EB Tokens?

EB Tokens are tokens that are 10 digits long, start with a 9, and are validated by the [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm).

## Configuration

The service is configured using environemnt variables. These variables are loaded from a `.env` file. By default the `.env` file in the root project folder will be used. However, you can specify a file by passing it using the `--envFile` argument when starting the service (e.g. `npm run server:start -- --envFile=secrets/env.test`).

A sample env file is provided: `./.env.dist`.

The following environment variables should be provided:

- `PORT` — The port to listen on.
- `LOG_ENABLED` - If set to a truthy value, logs will be enabled.
- `CORS_ORIGINS` - A comma-separated list of origins that may be included in the `Access-Control-Allow-Origin` response header. Basically if a request is made from an origin included in this list, it will be sent back in the `Access-Control-Allow-Origin` response header. If `*` is provided, then `*` will be the value of the `Access-Control-Allow-Origin` response header.
- `CORS_METHOS` - The list of methods to included in the `Access-Control-Allow-Methods` response header. If `*` is provided, then `*` will be the value of the `Access-Control-Allow-Methods` response header.

## Setup

```
git clone https://github.com/cullylarson/eb-tokens-api.git
npm install
cp .env.dist .env
vim .env
# set environment variables
```

## Production

Build the project (see the Setup section) and deploy using the environment of your choice. To start the server, run `npm run server:start`.


## Development

When setting up the service for development, you must use `secrets/env.dev` as the name of your env file (see the Configuration section).

1. Start the server using `npm run server:start:dev`. This will start the serer and reload on any change to files in the `./server` folder.

2. Run `npm run lint` to lint the project.

You can run the service using the provided `docker-compose.yml` file using `docker-compose up -d`. The service will be listening on port 3000 (unless changed in the env file).

## Testing

There are two kinds of tests you can run on this service: unit (`npm run test:unit`) and integration (`npm run test:integration`). Unit tests are just run locally using jest. The integration test are run inside Docker, against the API itself.

To run the integration tests, you will need to create an env file in `secrets/env.test`

## API

### GET `/v1/token`

Generates a new, cryptographically random EB Token.

#### Request

No parameters are accepted by this endpoint.

#### Response

Content Type: application/json

Status: 200

Parameters:

- **token** *(string)*. The EB Token.


### GET `/v1/token/validate`

Validates an EB Token.

#### Request

Parameters should be passed in the URL.

- **token** *(string: required)*. The EB Token you should to validated.

#### Response

Content Type: application/json

Status: 200 in all cases (i.e. whether the token is valid or not).

Parameters:

- **isValid** *(boolean)*. A boolean value indicating whether the provided token is valid (i.e. true if valid, false if not).
- **reasons** *(object[])*. If the token is not valid, this will be an array of objects that specify what was wrong with the token provided. Each object in the array has these values:
    - **code** *(string)*. An error code. This code identifies what went wrong. It will not change for the current API version. See `server/token/token-controller.js` for a list of possible codes.
    - **message** *(string)*. A human-readable error message that could be displayed to end-users. This message may change, but will always describe the error.
