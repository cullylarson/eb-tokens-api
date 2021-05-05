const {Router} = require('express')
const tokenController = require('./token-controller')

const getRouter = (logger) => {
    const router = Router()

    router.get('/', tokenController.generate(logger))
    router.get('/validate', tokenController.validate(logger))

    return router
}

module.exports = getRouter
