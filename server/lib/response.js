const {liftA} = require('@cullylarson/f')

const responseError = messages => ({
    errors: liftA(messages),
})

module.exports = {
    responseError,
}
