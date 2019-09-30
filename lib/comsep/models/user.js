
const mongoose = require('mongoose');

//const apps = require("../apps/apps");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true
    },
    encrypted_password: {type: String},
    gn_pin: {
        type: Number,
        index: true,
//        unique: true
    },
    fname: String,
    mname: String,
    lname: String
//    name: {
//        fname: String,
//        mname: String,
//        lname: String
//    }
});

userSchema.method({
    fullName: function() {
        let name = "";
//        if( this.name )
//            name = this.name.fname + " " + this.name.mname + " " + this.name.lname;
//        name = this.fname + " " + this.mname + " " + this.lname;
        name = (
            (this.fname ? this.fname + ' ' : '') + 
            (this.mname ? this.mname + ' ' : '') + 
            (this.lname ? this.lname : '')
        ).trim();

        return name;
    },

});
/*
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
*/

module.exports = userSchema;
