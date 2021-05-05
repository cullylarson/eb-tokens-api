const {randomBytes} = require('crypto')

const numericCharacters = '0123456789'.split('')

// taken from https://github.com/sindresorhus/crypto-random-string/blob/main/index.js
const generateForCustomCharacters = (length, characters) => {
    // Generating entropy is faster than complex math operations, so we use the simplest way
    const characterCount = characters.length
    const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1 // Using values above this will ruin distribution when using modular division
    const entropyLength = 2 * Math.ceil(1.1 * length) // Generating a bit more than required so chances we need more than one pass will be really low
    let string = ''
    let stringLength = 0

    while (stringLength < length) { // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
        const entropy = randomBytes(entropyLength)
        let entropyPosition = 0

        while (entropyPosition < entropyLength && stringLength < length) {
            const entropyValue = entropy.readUInt16LE(entropyPosition)
            entropyPosition += 2
            if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
                continue
            }

            string += characters[entropyValue % characterCount]
            stringLength++
        }
    }

    return string
}

// adapted from https://github.com/sindresorhus/crypto-random-string/blob/main/index.js
const cryptoRandomnNumberString = (length) => {
    return generateForCustomCharacters(length, numericCharacters)
}

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

    const randNumStr = cryptoRandomnNumberString(randLength)

    const numStr = (leadingDigit !== null) ? ('' + leadingDigit + randNumStr) : randNumStr

    return '' + numStr + getChecksum(numStr)
}

module.exports = {
    generate,
}
