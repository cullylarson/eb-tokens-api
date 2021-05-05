const request = require('supertest')
const validate = require('fast-luhn')
const {baseUrl} = require('./utils')

const fetchAndValidateToken = () => {
    return request(baseUrl)
        .get('/token')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            const token = res.body.token

            expect(token).toBeDefined()
            expect(token.length).toBe(10)
            expect(token.charAt(0)).toBe('9')
            expect(validate(token)).toBe(true)
        })
}

test('Generates valid tokens.', async () => {
    return Promise.all([
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
        fetchAndValidateToken(),
    ])
})
