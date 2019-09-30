'use strict'

const fp = require('fastify-plugin')
//const mongoose = require('mongoose')
//const Schema = mongoose.Schema;

module.exports = fp(async function (fastify, opts) {

    fastify.register(require('../lib/plugins/mongoose'), {
        uri: process.env.MONGODB_URI,
        models: require('../lib/comsep/models')
    }, err => {
        if (err) throw err
    })

})

