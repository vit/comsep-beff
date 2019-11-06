'use strict'

module.exports = async function (fastify, opts) {


  fastify.post('/wf/send', function (request, reply) {

//    const TestModel = this.mongoose.Test;
    const WorkflowModel = this.mongoose.Workflow;
    const {id, role, name, payload} = request.body;

    if(id) {
      WorkflowModel.findById(id,
        function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
            return;
          }
          if(!rez) {
            createStandardRecord(WorkflowModel, id, function(rez) {
              if(!rez) {
                reply.send({reply: null, error: `object with id '${id}' not found` })
              } else {
                reply.send({reply: rez, error: null })
              }
            });
          } else {
            rez.sendEvent(role, name, payload, function() {
              reply.send({reply: rez, error: null })
            });
          }
        }
      )
    } else {
//      reply.send({reply: null, error: `object with id ${id} not found` })
      reply.send({reply: null, error: "object id is not set" })
    }
  })

  fastify.post('/wf/query', {
    preValidation: [fastify.authenticate]
  }, function (request, reply) {
    const WorkflowModel = this.mongoose.Workflow;
    let {meta, event, query} = request.body;
    meta = meta || {};
    event = event || {};
    query = query || [];

    meta.user = request.user;

    if(meta.wf_id && meta.user_role) {
      WorkflowModel.findById(meta.wf_id,
        function (err, wf) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
            return;
          }
          if(wf) {
            const q_rez = [];
            for(let i=0; i<query.length; i++) {
              const query_name = query[i];
              //meta.query_name = query_name;
              wf.doQuery({query_name, payload: {}, meta}, function(result) {
                q_rez.push({name: query_name, result});
              });
            }
            reply.send({reply: q_rez, error: null })
          }
        }
      )
    } else {
      reply.send({reply: null, error: "wf_id is not set" })
    }
  })

  fastify.post('/wf/getSchema', function (request, reply) {

    const WorkflowModel = this.mongoose.Workflow;
    const {id} = request.body;

    if(id) {
      WorkflowModel.findById(id,
        function (err, rez) {
          if(err) {
            reply.send({reply: null, error: `error '${err}'` })
            return;
          }
          if(!rez) {
            createStandardRecord(WorkflowModel, id, function(rez) {
              if(!rez) {
                reply.send({reply: null, error: `object with id '${id}' not found` })
              } else {
                reply.send({reply: rez, error: null })
              }
            });
          } else {
            rez.getSchema(function(schema) {
              reply.send({reply: schema, error: null })
            });
          }
        }
      )
    } else {
//      reply.send({reply: null, error: `object with id ${id} not found` })
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


  fastify.post('/wf/getDoc', function (request, reply) {

    const DocModel = this.mongoose.Doc;
    const {docMeta} = request.body;

    DocModel.getDoc({docMeta},
      function (err, rez) {
        if(err) {
          reply.send({reply: null, error: `error '${err}'` })
        } else {
          reply.send({reply: rez, error: null })
        }
      }
    );

  });
  fastify.post('/wf/saveDoc', function (request, reply) {

    const DocModel = this.mongoose.Doc;
    const {docMeta, formData} = request.body;

    DocModel.saveDoc({docMeta, formData},
      function (err, rez) {
        if(err) {
          reply.send({reply: null, error: `error '${err}'` })
        } else {
          reply.send({reply: rez, error: null })
        }
      }
    );

  });
  fastify.post('/wf/listDocs', function (request, reply) {

    const DocModel = this.mongoose.Doc;
    const {docMeta} = request.body;

    DocModel.listDocs({docMeta},
      function (err, rez) {
        if(err) {
          reply.send({reply: null, error: `error '${err}'` })
        } else {
          reply.send({reply: rez, error: null })
        }
      }
    );

  });



  fastify.post('/wf/getList', function (request, reply) {

    const WorkflowModel = this.mongoose.Workflow;
//    const {id, event, payload} = request.body;

    WorkflowModel.find({},
      function (err, rez) {
        if(err) {
          reply.send({reply: null, error: `error '${err}'` })
        } else {
          reply.send({reply: rez, error: null })
        }
      }
    );

  });

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

function createStandardRecord(model, id, cb) {
  console.log("createStandardRecord:", id);
  if("__ROOT__"==id) {
    const data = {
      _id: id,
      state: "initial",
      app: "__ROOT__",
      cnt: 0,
      title: "Root Workflow"
    };
    model.create(data, function (err, rez) {
      if (err)
        cb(null);
      else
        cb(rez);
    });
  } else {
    cb(null);
  }
}


