
const mongoose = require('mongoose');

const apps = require("../apps/apps");


const workflowSchema = new mongoose.Schema({
//    state: [String]
//    _id: {type: String},
    slug: {type: String},
    state: {type: String, default: 'initial'},
    app: {type: String},
    cnt: {type: Number, default: 0},
    title: {type: String},
    data: {}
});

workflowSchema.index({ slug: 1 }, {unique: true, partialFilterExpression: {slug: { $exists: true } }});

workflowSchema.method({

    sendEvent: function({ctx, role_name, event_name, form, cb}) {
        console.log("sendEvent()");
        cb();
//        this.machine.process_event_with_target(this, {role, name, payload}, cb)
//        this.save(function() { cb(); });
    },
/*
    sendEvent: function(role, name, payload, cb) {
        console.log("sendEvent()");
        this.machine.process_event_with_target(this, {role, name, payload}, cb)
//        this.save(function() { cb(); });
    },
*/
//    doQuery: function(user, role, name, payload, cb) {
    doQuery: function({query_name, payload, meta}, cb) {
//        console.log("doQuery()");
//        cb( this.machine.process_query_with_target(this, {user, role, name, payload}) );
//        cb( this.machine.process_query_with_target(this, {payload, meta}) );
        cb( this.machine.process_query_with_target(this, {query_name, payload, meta}) );
//        cb( "my query answer" );
/*
        cb({
            answer: "doQuery() answer",
            query_name,
            meta,
            payload
        });
*/
    },
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
//        cb(this.machine.schema)
//        cb( JSON.parse( JSON.stringify(this.machine.schema) ) )
//        cb( this.machine.get_schema_marked(this) );
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
workflowSchema.static({

    rpc: {
        send_event: function({ctx, args, cb}) {
            const {event_name, role_name, workflow_id} = args.form_meta;
//            const user_id = ctx.user._id;
            this.findById(workflow_id, function(err, wf) {
                if(err) {
                    cb( {ok: false, err}, null );
                } else {
//                    console.log("send_event()/wf:", wf);
//                    console.log("send_event()/wf._id:", wf._id);
//                    console.log("send_event()/wf._id.getTimestamp():", wf._id.getTimestamp());
//                    console.log("send_event()/err:", err);
//                    wf.sendEvent(role_name, event_name, args);

                    ctx.models.EventForm.get_event_form({ctx, args, cb: (form, err) => {
                        console.log("send_event()/err:", err);
                        console.log("send_event()/form:", form);
                        wf.sendEvent({ctx, role_name, event_name, form, cb: (err) => {
                            console.log("send_event()/sent_ok", wf);
                        } });
                        cb( {ok: true, workflow_id: wf._id}, null );
                    } })
                }
            });
//*/

        },
    },


    sendEventById: function(id, event, args={}) {
        this.findById(id, function(err, wf) {
            if(err) throw err;
            wf.sendEvent(id, event, args);
        });
    }
});
workflowSchema.virtual('machine').get(function () {
  return apps[this.app];
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
