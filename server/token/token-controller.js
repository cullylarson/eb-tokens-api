module.exports = {
    generate: (logger) => async (req, res) => {
        logger('NOTICE', 'the-code', 'A brief message.', {some: 'data'}, req)
        return res.json({})
    },

    validate: (logger) => async (req, res) => {
        return res.json({})
    },
}
