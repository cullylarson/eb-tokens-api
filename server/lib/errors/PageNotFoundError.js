function PageNotFoundError(code, error) {
    const message = error ? error.message : ''
    this.name = 'PageNotFoundError'
    this.message = message
    Error.call(this, message)
    Error.captureStackTrace(this, this.constructor)
    this.code = code
    this.status = 404
    this.inner = error
}

PageNotFoundError.prototype = Object.create(Error.prototype)
PageNotFoundError.prototype.constructor = PageNotFoundError

module.exports = PageNotFoundError
