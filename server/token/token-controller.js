const validate = require('fast-luhn')
const {messageObj} = require('@@app/lib/response')
const {generate} = require('@@app/lib/luhn')

module.exports = {
    generate: (logger) => async (req, res) => {
        return res.json({token: generate({length: 10, leadingDigit: 9})})
    },

    validate: (logger) => async (req, res) => {
        const respondNotValid = reason => {
            return res.json({
                isValid: false,
                reasons: [reason],
            })
        }

        const token = req.query.token || null

        if(!token) {
            return respondNotValid(messageObj('is-empty', 'The token cannot be empty.'))
        }

        if(!token.charAt || token.charAt(0) !== '9') {
            return respondNotValid(messageObj('bad-leading-digit', 'The token must begin with a nine.'))
        }

        if(token.length !== 10) {
            return respondNotValid(messageObj('wrong-length', 'The token must be 10 digits long.'))
        }

        if(/[^0-9]/.test(token)) {
            return respondNotValid(messageObj('not-numeric', 'The token must be made of only numbers.'))
        }

        if(!validate(token)) {
            return respondNotValid(messageObj('bad-checksum', 'The token you have provided does not have a valid checksum.'))
        }

        return res.json({isValid: true})
    },
}
