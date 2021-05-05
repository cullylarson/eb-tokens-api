const {compose, get, pick, split, last, isString, isObject} = require('@cullylarson/f')

const LogLevels = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    NOTICE: 'NOTICE',
    WARN: 'WARN',
    ERROR: 'ERROR',
    ALERT: 'ALERT',
    FATAL: 'FATAL',
}

// splits off any ipv6 stuff (e.g. node seems to like '::ffff:172.27.0.1' as an ip) and returns the ipv4 bit. if
// the ipv4 bit doesn't match an IP, will return undefined
const formatIpv4 = x => {
    if(!x || !isString(x)) return undefined

    return compose(
        x => /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(x) ? x : undefined,
        last,
        split(':'),
    )(x)
}

const reqToObj = pick(['baseUrl', 'body', 'fresh', 'hostname', 'ip', 'ips', 'method', 'originalUrl', 'params', 'path', 'protocol', 'query', 'secure', 'xhr'])

const reqToIp = compose(formatIpv4, get('ip', undefined))

const errorToObj = err => {
    if(!isObject(err)) return err

    const elasticSearchError = get(['meta', 'body', 'error', 'root_cause'], [], err)
        .map(get('reason', null))
        .filter(Boolean)
        .join(' | ')

    const errMessage = get('message', undefined, err)

    const finalMessage = [
        errMessage || null,
        elasticSearchError || null,
    ]
        .filter(Boolean)
        .join(': ')

    return {
        name: get('name', undefined, err),
        errno: get('errno', undefined, err),
        code: get('code', undefined, err),
        message: finalMessage || undefined,
        stack: get('stack', undefined, err),
    }
}

const ConsoleLogger = (level, code, message, data = {}, request = null, exception = null) => {
    const now = new Date()

    // use console.info to indicate this log is intentional and not here for debugging
    console.info(JSON.stringify({
        stamp: now.getTime(),
        stampHuman: now.toString(),
        level,
        code,
        message,
        data,
        request: request ? reqToObj(request) : null,
        ip: request ? reqToIp(request) : null,
        exception: exception ? errorToObj(exception) : null,
    }))
}

module.exports = {
    LogLevels,
    ConsoleLogger,
}
