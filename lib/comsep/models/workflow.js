
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
                    ctx.models.EventForm.get_event_form({ctx, args, cb: (form, err) => {
//                        console.log("send_event()/err:", err);
//                        console.log("send_event()/form:", form);
//                        wf.sendEvent({ctx, role_name, event_name, form, cb: (err, result) => {
                        wf.sendEvent({ctx, role_name, event_name, form, cb: (result, error) => {
                            cb( {ok: true, workflow_id: wf._id, result, error}, null );
                        } });
                    } })
                }
            });
//*/

        },
    },

    create_workflow: function(args, cb) {
        const {slug, title, current_workflow} = args;
        let {type} = args;

//        const parent_workflow_name = current_workflow.get_app_name();

//        let parent_workflow;
//        if( current_workflow )
//            parent_workflow = current_workflow.get_app_workflow();

        console.log("create_workflow()/args:", args);

        let parent;

        if( type.startsWith(':') )
            type = type.substr(1);
        else
            if(current_workflow) {
                parent = current_workflow;
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


/*
        this.create({
            slug,
            parent,
            state: "initial",
            app: type,
            cnt: 0,
            title
        }, function (err, rez) {
        });
*/

        cb({create_workflow_ok: true});

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
