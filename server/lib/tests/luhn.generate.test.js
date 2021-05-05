const validate = require('fast-luhn')
const {generate} = require('../luhn')

const expectLengthLeadingValid = ({length, leadingDigit = null}) => {
    const token = generate({length, leadingDigit})

    expect(validate(token)).toBe(true)
    expect(token.length).toBe(length)

    if(leadingDigit !== null) {
        expect(token.charAt(0)).toBe(leadingDigit.toString())
    }
}

test('Generates valid tokens with a defined length and no leading digit.', () => {
    expectLengthLeadingValid({length: 10})
    expectLengthLeadingValid({length: 5})
    expectLengthLeadingValid({length: 3})
    expectLengthLeadingValid({length: 20})
    expectLengthLeadingValid({length: 25})
    expectLengthLeadingValid({length: 17})
    expectLengthLeadingValid({length: 53})
    expectLengthLeadingValid({length: 80})
    expectLengthLeadingValid({length: 100})
})

test('Generates valid tokens with a defined length and leading digit.', () => {
    expectLengthLeadingValid({length: 10, leadingDigit: 1})
    expectLengthLeadingValid({length: 5, leadingDigit: 2})
    expectLengthLeadingValid({length: 3, leadingDigit: 3})
    expectLengthLeadingValid({length: 20, leadingDigit: 4})
    expectLengthLeadingValid({length: 25, leadingDigit: 5})
    expectLengthLeadingValid({length: 17, leadingDigit: 6})
    expectLengthLeadingValid({length: 53, leadingDigit: 7})
    expectLengthLeadingValid({length: 80, leadingDigit: 8})
    expectLengthLeadingValid({length: 100, leadingDigit: 9})
    expectLengthLeadingValid({length: 33, leadingDigit: 0})
})

test('Throws an exception if the length is less 2.', () => {
    expect(() => generate({length: 1})).toThrow()
    expect(() => generate({length: 0})).toThrow()
    expect(() => generate({length: 1, leadingDigit: 2})).toThrow()
    expect(() => generate({length: 0, leadingDigit: 9})).toThrow()
})

test('Will generate a token with just a leading character.', () => {
    expectLengthLeadingValid({length: 2, leadingDigit: 1})
    expectLengthLeadingValid({length: 2, leadingDigit: 2})
    expectLengthLeadingValid({length: 2, leadingDigit: 3})
    expectLengthLeadingValid({length: 2, leadingDigit: 4})
    expectLengthLeadingValid({length: 2, leadingDigit: 5})
    expectLengthLeadingValid({length: 2, leadingDigit: 6})
    expectLengthLeadingValid({length: 2, leadingDigit: 7})
    expectLengthLeadingValid({length: 2, leadingDigit: 8})
    expectLengthLeadingValid({length: 2, leadingDigit: 9})
    expectLengthLeadingValid({length: 2, leadingDigit: 0})
})
