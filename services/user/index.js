'use strict'

module.exports = async function (fastify, opts) {

  fastify.get('/user/me', function (request, reply) {
    reply.send({msg: "It's me again!"})
  })

}
