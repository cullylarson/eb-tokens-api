require('module-alias/register')
const express = require('express')
const cors = require('cors')
const {responseError, messageObj} = require('@@app/lib/response')
const PageNotFoundError = require('@@app/lib/errors/PageNotFoundError')
const {ConsoleLogger, LogLevels} = require('@@app/lib/logger')
const TokenRouter = require('./token')

const getConfig = envFile => {
    require('dotenv').config({path: envFile})

    const port = process.env.PORT || 3000
    const logEnabled = Boolean(process.env.LOG_ENABLED)

    const corsOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(x => x.trim())
        .map(x => x.replace(/\/$/, '')) // remove trailing slash

    const corsMethods = process.env.CORS_METHODS || 'GET, POST, DELETE'

    return {
        port,
        logEnabled,
        corsOrigins,
        corsMethods,
    }
}

const CheckError = (logger) => (err, req, res, next) => {
    switch(err.name) {
        case 'PageNotFoundError':
            return res.status(404).json(responseError(messageObj('page-not-found', 'Page not found.')))
        case 'SyntaxError':
            // TODO -- might not need to catch this error if no endpoint requires JSON

            logger(
                'app-response-error-json',
                LogLevels.NOTICE,
                'Response: JSON format syntax error.',
                {},
                req,
                err,
            )

            return res.status(400).json(responseError(messageObj('bad-json', 'Your JSON request is not formatted correctly.')))
        default:
            logger(
                'app-response-error-unknown',
                LogLevels.NOTICE,
                'Response: unknown error.',
                {},
                req,
                err,
            )

            return res.status(500).json(responseError(messageObj('unknown', 'Unknown error.')))
    }
}

const {envFile} = require('yargs')
    .usage('Usage: $0 [options]')
    .help('h')
    .options({
        envFile: {
            describe: 'Load environment variables from a file.',
            default: '.env',
            type: 'string',
        },
    })
    .argv

const config = getConfig(envFile)

const app = express()

const logger = config.logEnabled
    ? ConsoleLogger
    : () => {}

// if we have an uncaught exception, something really bad happened. we want to restart
// so that the service doesn't stay in an unexpected state.
process.on('uncaughtException', err => {
    // don't use the logger because we could create an infinite loop (e.g. if calling the loger produces an exception)
    console.error('Uncaught exception. Exiting. Got error: ', err)
    process.exit(11)
})

// if we have an uhandled rejection, something really bad happened. we want to restart
// so that the service doesn't stay in an unexpected state.
process.on('unhandledRejection', err => {
    // don't use the logger because we could create an infinite loop (e.g. if calling the loger produces an exception)
    console.error('Unhandled promise rejection. Exiting. Got error: ', err)
    process.exit(22)
})

app.use((req, res, next) => {
    res.set('X-Powered-By', 'cully larson')
    next()
})

app.use(cors({
    origin: (origin, callback) => {
        // allow if:
        // - an origin is *
        // - or, origin is in the list
        // - or, no origin, which means it isn't a CORS request (i.e. not from a browser)
        if(config.corsOrigins.includes('*') || config.corsOrigins.includes(origin) || !origin) {
            return callback(null, true)
        }
        else {
            return callback(new Error('Not allowed by CORS.'))
        }
    },
    methods: config.corsMethods,
}))

const handle404 = (req, res, next) => {
    // CheckError will handle this
    return next(new PageNotFoundError())
}

// tell express whether we're behind a proxy so it can trust certain headers that the proxy provides.
app.set('trust proxy', (ip, trustProxy) => {
    // this callback can be called multiple times on a single request. if a previous call already returned true, then return true as well
    if(trustProxy) return trustProxy
    // if we're on localhost, then we're behind a proxy
    else return ['127.0.0.1', '::ffff:127.0.0.1', '::1'].includes(ip)
})

app.use('/v1/token', TokenRouter(logger))
app.use(handle404)
app.use(CheckError(logger))

app.listen(config.port)
