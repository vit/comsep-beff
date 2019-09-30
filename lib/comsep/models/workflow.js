
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
    getSchema: function(cb) {
        console.log("getSchema()");
//        cb(this.machine.schema)
//        cb( JSON.parse( JSON.stringify(this.machine.schema) ) )
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
