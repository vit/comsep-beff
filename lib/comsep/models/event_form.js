
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const eventFormSchema = new mongoose.Schema({
    form_key: {
        workflow_id: ObjectId,
        event_name: String,
        user_id: ObjectId,
        role_name: String,
        form_name: String,
        is_draft: Boolean,
    },
    form_fields: {}
});

eventFormSchema.static({
//    rpc0: async function({proc, args, cb}) {
//        cb('rpc ok');    
//    },
    rpc: {
        list_my_event_forms: async function({ct, args, cb}) {
            const user_id = ct.user ? ct.user._id : null;
            //const 
            
            cb({user: ct.user, args});
        },
        get_my_event_form: async function({ct, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ct.user._id;
            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};

            const form_fields = {title: 'ttt', abstract: 'aaa'};

            cb({user: ct.user, args, form_key, form_fields});
        },
        set_my_event_form_fields: async function({ct, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const {form_fields} = args;
            const user_id = ct.user._id;
            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};

            cb({user: ct.user, args, form_key, form_fields});
        },
        drop_my_event_form: async function({ct, args, cb}) {
            cb({user: ct.user, args});
        },
    },

    get_my_event_form: async function({docMeta}, cb) {
        const filter = { meta: docMeta };

        try {
            const doc = await this.findOne(filter);
            cb( null, doc );
        }
        catch(err) {
            cb( err, null );
            return;
        }
        cb( null, null );

    },
    save_my_event_form_fields: async function({docMeta, formData}, cb) {
        const filter = { meta: docMeta };
        const update = { doc: formData };
    
        console.log("save_my_event_form_fields()", docMeta, formData);

        try {
            const doc = await this.findOneAndUpdate(filter, update, {
                new: true,
                //strict: false,
                upsert: true // Make this update into an upsert
            });
            cb( null, doc );
        }
        catch(err) {
            cb( err, null );
            return;
        }
        cb( null, null );

    },
    list_my_event_forms: async function({docMeta}, cb) {
        const filter = { 'meta.eventName': 'new_submission' };
        const docs = await this.find(filter);
        cb( null, docs );
    },
});

module.exports = eventFormSchema;
