'use strict'

module.exports = async function (fastify, opts) {

  fastify.post('/wf/getSchema', function (request, reply) {

    const WorkflowModel = this.mongoose.Workflow;
    const {id} = request.body;

    if(id) {
      WorkflowModel.findById(id,
        function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
            return;
          } else if(rez) {
            rez.getSchema(function(schema) {
              reply.send({reply: schema, error: null })
            });
          } else {
            reply.send({reply: null, error: `object with id '${id}' not found` })
          }
        }
      )
    } else {
      reply.send({reply: null, error: "object id is not set" })
    }
  })


  fastify.post('/wf/getContextData', function (request, reply) {

    const WorkflowModel = this.mongoose.Workflow;
    const {context_name} = request.body;

//    reply.send({reply: {context_name, ok: true}, error: null })

///*
    if(context_name) {
      WorkflowModel.findOne({slug: context_name},
        function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
            return;
          }
          if(!rez) {
            reply.send({reply: null, error: `object with name '${context_name}' not found` })
          } else {
//            reply.send({reply: rez, error: null })
            rez.getData(function(data) {
              reply.send({reply: data, error: null })
            });
          }
        }
      )
    } else {
      reply.send({reply: null, error: "context_name is not set" })
    }
//*/
  })


//  fastify.post('/wf/getLibItem', function (request, reply) {
  fastify.get('/wf/getLibItem', function (request, reply) {

    const LibItemModel = this.mongoose.LibItem;
//    const {id} = request.body;
    const {id} = request.query;
    console.log("id:", id);

    const result = {
      doc: null,
      children: [],
      ancestors: []
    };

    if(id) {
      LibItemModel.find({parent: id},
        async function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
          } else {
            result.children = rez;

            const rez2 = await LibItemModel.findById(id);
//            console.log("rez:", rez2);
            result.doc = rez2;

            if(rez2) {
              let _id = rez2.parent;
              while(_id) {
                const rez3 = await LibItemModel.findById(_id);
                const title = rez3 ? rez3.title : null;
                result.ancestors.unshift({_id, title});                
                _id = rez3 ? rez3.parent : null;
              }
            }

            reply.send({reply: result, error: null })


          }
        }
      );
    } else {
      LibItemModel.find({parent: null},
        function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
          } else {
            result.children = rez;
            reply.send({reply: result, error: null })
          }
        }
      );
    }
  });

}

