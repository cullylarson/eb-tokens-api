const cryptoRandomString = require('crypto-random-string')

// taken from https://github.com/rromanovsky/luhn-generator/blob/master/src/index.js
const getChecksum = (input) => {
    const string = input.toString()
    let sum = 0
    let parity = 2

    for (let i = string.length - 1; i >= 0; i--) {
        const digit = Math.max(parity, 1) * string[i]

        sum += digit > 9 ? digit.toString().split('').map(Number).reduce((a, b) => a + b, 0) : digit
        parity *= -1
    }

    sum %= 10

    return sum > 0 ? 10 - sum : 0
}

// generates a cryptographically random number that passes the luhn algorithm
const generate = ({
    length, // must be at least 2
    leadingDigit = null,
}) => {
    leadingDigit = (leadingDigit === null) ? null : '' + leadingDigit

    // the length needs to be at least two so that we have a number and the checksum
    if(length < 2) throw new RangeError('Length must be at least 2.')

    // the length of the number we need to generate is (1 - length) since the last digit is the checksum
    const generateLength = length - 1

    // if we have a leading digit, then the random number is (generateLength - 1) since we already have the leading digit
    const randLength = (leadingDigit !== null) ? (generateLength - 1) : generateLength

    const randNumStr = cryptoRandomString({length: randLength, type: 'numeric'})

    const numStr = (leadingDigit !== null) ? ('' + leadingDigit + randNumStr) : randNumStr

    return '' + numStr + getChecksum(numStr)
}

module.exports = {
    generate,
}
