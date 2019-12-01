
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const apps = require("../apps/apps");


const workflowSchema = new mongoose.Schema({
    parent: ObjectId,
    ancestors: [ObjectId],
    slug: {type: String},
    state: {type: String, default: 'initial'},
    app: {type: String},
    cnt: {type: Number, default: 0},
    title: {type: String},
    data: {}
});

workflowSchema.index({ slug: 1 }, {unique: true, partialFilterExpression: {slug: { $exists: true } }});

workflowSchema.method({

//    sendEvent: function({ctx, role_name, event_name, form, cb}) {
    sendEvent: function(args) {
//        console.log("sendEvent()");
//        cb();
        const {ctx, role_name, event_name, form, cb} = args;
        this.machine.process_event_with_target({target: this, ctx, role_name, event_name, payload: {form}, cb})
    },

    get_app_workflow: function() {
        return this.parent ? this.parent.get_app_workflow() : this;
    },
    get_app_name: function() {
        return this.get_app_workflow().machine.APP_NAME;
    },

/*
    new_workflow: function(args, cb) {
//        console.log("sendEvent()");
//        cb();
        const {type} = args;
        if( ! type.startsWith(':') )
            args.type = this.machine.APP_NAME + ':' + type;
//        this.machine.process_event_with_target({target: this, ctx, role_name, event_name, payload: {form}, cb})

        this.constructor.create_workflow(args);

        console.log("new_workflow()/args.type:", args.type);
        cb({ok: true});
    },
*/


/*
    sendEvent: function(role, name, payload, cb) {
        console.log("sendEvent()");
        this.machine.process_event_with_target(this, {role, name, payload}, cb)
//        this.save(function() { cb(); });
    },
*/

/*
    doQuery: function({ctx, query_name, payload, meta}) {
        return this.machine.process_query_with_target(this, {ctx, query_name, payload, meta});
    },
*/
///*
    doQuery: function({ctx, query_name, payload, meta}, cb) {
        this.machine.process_query_with_target(this, {ctx, query_name, payload, meta}, (result, error) => {
            cb( result, error );
        });
    },
//*/

    getSchema: function(cb) {
        console.log("getSchema()");
        cb( this.machine.get_schema_marked(this) );
    },
    getData: function(cb) {
        console.log("getData()");
        const result={
            id: this._id,
            workflow: this,
            schema: this.machine.schema,
            forms: this.machine.forms,
        }
        cb( result );
    },
    inc: function(cb) {
        console.log("inc()");
        this.cnt = this.cnt ? this.cnt+1 : 0;
        this.save(function() { cb(); });
//    },
//    attach_machine: function(machine) {
//        this.machine = machine;
    }

});

/*
  function doQueriesList(args, cb) {
    const {wf, ctx, meta, query, acc} = args;
    const query_name = query.shift();
    if(query_name) {
      wf.doQuery({ctx, query_name, payload: {}, meta}, function(result, error) {
        acc.push({name: query_name, result, error});
        doQueriesList(args, cb);
      });
    } else {
      cb(acc);
    }
  }
*/


workflowSchema.static({

    rpc: {
        send_event: function({ctx, args, cb}) {
            const {event_name, role_name, workflow_id} = args.form_meta;
//            const user_id = ctx.user._id;
            this.findById(workflow_id, function(err, wf) {
                if(err) {
                    cb( {ok: false, err}, null );
                } else {
                    ctx.models.EventForm.get_event_form({ctx, args, cb: (form, err) => {
                        wf.sendEvent({ctx, role_name, event_name, form, cb: (result, error) => {
                            cb( {ok: true, workflow_id: wf._id, result, error}, null );
                        } });
                    } })
                }
            });
        },

        query: function({ctx, args, cb}) {
            let {meta, query} = args;
            meta = meta || {};
            query = query || [];
            meta.user = ctx.user;

            const {role_name, workflow_id} = meta;

            this.findById(workflow_id, async function(err, wf) {
                if(err) {
                    cb( {ok: false, err}, null );
                } else {
                    cb( await Promise.all(
                        query.map(
                            query_name => new Promise( (resolve, reject) => {
                                wf.doQuery({ctx, query_name, payload: {}, meta}, (result, error) => {
                                    resolve( {
                                            name: query_name,
                                            result,
                                            error
                                    } )
                                })
                            })
                        )
                    ))
//                    doQueriesList({wf, ctx, meta, query: [...query], acc: []}, (acc, error) => {
//                        cb(acc)
//                    })

                }
            });
        },
    },

    create_workflow: function(args, cb) {
        const {slug, title, current_workflow, payload} = args;
        let {type} = args;
        const {form} = payload;
        let ancestors = [];

        console.log("create_workflow()/args:", args);

        let parent;

        if( type.startsWith(':') )
            type = type.substr(1);
        else
            if(current_workflow) {
                parent = current_workflow;
                ancestors = parent.ancestors || [];
//                ancestors = [ ...ancestors, parent._id ];
                ancestors = [ parent._id, ...ancestors ]; // reverse order -- 
                //.get_app_workflow()
                type = current_workflow.get_app_name() + ':' + type;
            }

        console.log("create_workflow()/args-2:", args);
        console.log("create_workflow()/data:", {
            parent,
            slug,
            type,
            title
        });


///*
        this.create({
            slug,
            parent: parent._id,
            ancestors,
            state: "initial",
            app: type,
            cnt: 0,
            title
        }, function (err, rez) {
            console.log("create_workflow()/create/err:", err);
            console.log("create_workflow()/create/rez:", rez);
            cb(rez, err);
        });
//*/

//        cb({create_workflow_ok: true});

    },

    sendEventById: function(id, event, args={}) {
        this.findById(id, function(err, wf) {
            if(err) throw err;
            wf.sendEvent(id, event, args);
        });
    }
});
workflowSchema.virtual('machine').get(function () {
    return apps.get_by_name(this.app);
//    return apps[this.app];
});

//workflowSchema.post('init', function(wf) {
//    const machine = apps[wf.app]();
//    wf.attach_machine( machine );
//    wf.xxx = "xxx";
//    console.log("init:", wf._id, wf.app);
//    console.log("wf:", wf);
//    console.log("apps:", apps);
//    console.log("machine:", wf.machine);
//});


module.exports = workflowSchema;
