# eb-tokens-api

> A REST API for generating and validating Echobind Tokens.

## What are EB Tokens?

EB Tokens are tokens that are 10 digits long, start with a 9, and are validated by the [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm).

## Configuration

TODO

## Setup

```
git clone https://github.com/cullylarson/eb-tokens-api.git
npm install
```

## Production

Build the project (see the Setup section) and deploy using the environment of your choice. To start the server, run `npm run server:start`.


## Development

1. Start the server using `npm run server:start:dev`. This will start the serer and reload on changes to files in the `./server` folder.

2. Run `npm run lint` to lint the project.

3. Run `npm run test` to test.


## API

### GET `/v1/token`

Generates a new EB Token.

#### Request

No parameters are accepted by this endpoint.

#### Response

Content Type: application/json
Status: 200 in all cases (i.e. whether the token is valid or not).
Parameters:

- **token** *(string)*. The EB Token.


### GET `/v1/token/validate`

Validates an EB Token.

#### Request

Parameters should be passed in the URL.

- **token** *(string: required)*. The EB Token you should to validated.

#### Response

Content Type: application/json
Status: 200 in all cases (i.e. whether the token is valid or not). TODO -- maybe not if the token is not provided? Maybe not if its invalid in any case.
Parameters:

- **isValid** *(boolean)*. A boolean value indicating whether the provided token is valid (i.e. true if valid, false if not).
- **reasons** *(object[])*. If the token is not valid, this will be an array of objects that specifically what was wrong with the token provided.TODO
