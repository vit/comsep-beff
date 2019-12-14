'use strict'

module.exports = async function (fastify, opts) {
//module.exports = function (fastify, opts) {

  fastify.post('/rpc', {
    preValidation: [fastify.authenticate]
  }, function (request, reply) {
//  }, function (request, reply) {
    const models = this.mongoose;
    const {user, body} = request;
    const user_id = user && user.user ? user.user.id : null;

    models.User.findById(user_id, '-encrypted_password', function (err, user_rec) {
      const ctx = {models, user: user_rec};
      const {model, proc, args} = request.body;
  
//      console.log("/rpc/user_id:", user_id);
//      console.log("/rpc/user_rec:", user_rec);

      try {
        if(
          model &&
          models &&
          models[model]
        ) {
          if (
            models[model].rpc &&
            (typeof models[model].rpc[proc] == 'function')
          ) {
            models[model].rpc[proc].call(models[model], {ctx, args, cb: function(answer, error) {
              reply.send({answer: answer, request: request.body, error })
            }})
          } else {
            reply.send({answer: null, error: "rpc function not found" })
          }
        } else {
          reply.send({answer: null, error: "rpc model not found" })
        }
      }
      catch(error) {
        console.log("/rpc/exception:", error);
        reply.send({answer: null, error })
      }
    })

  })

}

