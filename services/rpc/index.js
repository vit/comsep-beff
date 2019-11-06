'use strict'

module.exports = async function (fastify, opts) {

//  fastify.post('/rpc/rpc', {
  fastify.post('/rpc', {
    preValidation: [fastify.authenticate]
  }, async function (request, reply) {
    const models = this.mongoose;
    const {user, body} = request;
    const user_id = user && user.user ? user.user.id : null;
    const user_rec = user_id ? (await models.User.findById(user_id, '-encrypted_password')) : null;
    const ct = {models, user: user_rec};
    const {model, proc, args} = request.body;



    if(
      model &&
      models &&
      models[model] &&
//      (typeof models[model].rpc == 'function')
      models[model].rpc &&
      (typeof models[model].rpc[proc] == 'function')
    ) {
//      models[model].rpc.call(models[model], {proc, args, cb: function(answer) {
      models[model].rpc[proc].call(models[model], {ct, args, cb: function(answer) {
        reply.send({answer: answer, request: request.body, error: null })
      }})
    } else {
      reply.send({answer: null, error: "rpc model not found" })
    }

  })

}


