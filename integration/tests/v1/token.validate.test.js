const request = require('supertest')
const {baseUrl} = require('./utils')

const validateToken = (token, expectValid = true, expectReasonCode = null) => {
    return request(baseUrl)
        .get('/token/validate')
        .query({token})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            expect(res.body.isValid).toBeDefined()

            if(expectValid) {
                expect(res.body.isValid).toBe(true)
            }
            else {
                expect(res.body.isValid).toBe(false)
            }

            if(expectReasonCode) {
                expect(res.body.reasons).toBeDefined()

                expect(Boolean(res.body.reasons.length)).toBe(true)

                const reason = res.body.reasons.find(x => x.code === expectReasonCode)

                expect(reason).toBeDefined()
                expect(reason.code).toEqual(expectReasonCode)
            }
        })
}

test('Recognizes valid tokens.', async () => {
    return Promise.all([
        validateToken('9907678883'),
        validateToken('9538977167'),
        validateToken('9880026092'),
        validateToken('9559946695'),
        validateToken('9160192929'),
    ])
})

test('Token invalid because incorrect length.', async () => {
    return Promise.all([
        validateToken('907678883', false, 'wrong-length'),
        validateToken('95387167', false, 'wrong-length'),
        validateToken('9802692', false, 'wrong-length'),
        validateToken('956695', false, 'wrong-length'),
        validateToken('96929', false, 'wrong-length'),
        validateToken('91160192929', false, 'wrong-length'),
    ])
})

test('Token invalid because empty.', async () => {
    return Promise.all([
        validateToken('', false, 'is-empty'),
    ])
})

test('Token invalid because does not start with a 9.', async () => {
    return Promise.all([
        validateToken('0907678883', false, 'bad-leading-digit'),
        validateToken('1538977167', false, 'bad-leading-digit'),
        validateToken('2880026092', false, 'bad-leading-digit'),
        validateToken('8559946695', false, 'bad-leading-digit'),
        validateToken('7160192929', false, 'bad-leading-digit'),
    ])
})

test('Token invalid because does not pass luhn.', async () => {
    return Promise.all([
        validateToken('9907678881', false, 'bad-checksum'),
        validateToken('9538977166', false, 'bad-checksum'),
        validateToken('9880026093', false, 'bad-checksum'),
        validateToken('9559946690', false, 'bad-checksum'),
        validateToken('9160192922', false, 'bad-checksum'),
    ])
})
