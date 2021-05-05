const {liftA} = require('@cullylarson/f')

const responseError = messages => ({
    errors: liftA(messages),
})

const messageObj = (code, message) => {
    return {
        code,
        message,
    }
}

module.exports = {
    responseError,
    messageObj,
}
