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

const ConsoleLogger = (level, code, message, data = {}, request = null, exception = null) => {
    // TODO
    console.info() // use console.info to indicate this log is intentional and not here for debugging
}

module.exports = {
    LogLevels,
    ConsoleLogger,
}
