
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

    rpc: {
        list_my_event_forms: function({ctx, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
//            const form_key = {user_id, is_draft: true};

            const query = {
                'form_key.user_id': user_id,
                'form_key.workflow_id': new mongoose.Types.ObjectId(workflow_id),
//                'form_key.workflow_id': workflow_id,
                'form_key.is_draft': true
            }

//            console.log("list_my_event_forms/query:", query);

            try {
                    this.collection.find(query).toArray(function(err, result) {
//                    this.find(query, function(err, result) {
//                        console.log("list_my_event_forms/result:", result);
                        cb(result);
                    });

            }
            catch(err) {
//                console.log("list_my_event_forms/err:", err);
                cb( null, err);
            }
        },
        get_my_event_form: function({ctx, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
            const form_key = {
                event_name, 
                form_name, 
                role_name,
                workflow_id: mongoose.Types.ObjectId(workflow_id),
                user_id,
                is_draft: true
            };

//            console.log("get_my_event_form/form_key:", form_key);

            this.findOne({form_key}, (err, doc) => {
                if(err || !doc)
                    cb( null, err);
                else
                    cb({user: ctx.user, args, form_key, form_fields: doc.form_fields});
            });
        },
        save_my_event_form_fields: function({ctx, args, cb}) {
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
        },
        drop_my_event_form: function({ctx, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
            const form_key = {event_name, form_name, role_name,
                workflow_id: mongoose.Types.ObjectId(workflow_id),
                user_id, is_draft: true};

            this.deleteMany({form_key}, (err, doc) => {
                if(err)
                    cb( null, err);
                else
                    cb({user: ctx.user, args, form_key});
            });

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
