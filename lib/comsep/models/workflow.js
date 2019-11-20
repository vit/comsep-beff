
const mongoose = require('mongoose');

const apps = require("../apps/apps");


const workflowSchema = new mongoose.Schema({
//    state: [String]
//    _id: {type: String},
    slug: {type: String},
    state: {type: String, default: 'initial'},
    app: {type: String},
    cnt: {type: Number, default: 0},
    title: {type: String}
});

workflowSchema.index({ slug: 1 }, {unique: true, partialFilterExpression: {slug: { $exists: true } }});

workflowSchema.method({
    sendEvent: function(role, name, payload, cb) {
        console.log("sendEvent()");
        this.machine.process_event_with_target(this, {role, name, payload}, cb)
//        this.save(function() { cb(); });
    },
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
/*
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
            const form_key = {event_name, form_name, role_name,
                workflow_id: mongoose.Types.ObjectId(workflow_id),
                user_id, is_draft: true};

            const {form_fields} = args;

            console.log("save_my_event_form_fields", form_key, form_fields);

            this.findOneAndUpdate({form_key}, {form_fields}, {
                new: true,
                //strict: false,
                upsert: true // Make this update into an upsert
            }, (err, doc) => {
                if(err)
                    cb( null, err );
                else
                    cb({user: ctx.user, args, form_key, form_fields: doc.form_fields});
            });
*/
            cb( {ok: 1}, null );
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
