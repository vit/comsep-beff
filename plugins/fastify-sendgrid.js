const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {

    fastify.register(require('../lib/plugins/sendgrid'), {
        api_key: process.env.SENDGRID_API_KEY,
    }, err => {
        if (err) throw err
    })

})
