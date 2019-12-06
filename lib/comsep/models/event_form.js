
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const eventFormSchema = new mongoose.Schema({
    form_key: {
        workflow_id: ObjectId,
        event_name: String,
        user_id: ObjectId,
        role_name: String,
//        form_name: String,
        is_draft: Boolean,
    },
    form_name: String,
    form_fields: {}
});

eventFormSchema.static({

    get_event_form: function({ctx, args, cb}) {
//        const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
        const {event_name, role_name,  workflow_id} = args.form_meta;
        const user_id = ctx.user._id;
        const form_key = {
            event_name, 
//            form_name, 
            role_name,
            workflow_id: mongoose.Types.ObjectId(workflow_id),
            user_id,
            is_draft: true
        };

        this.findOne({form_key}, (err, doc) => {
            if(err || !doc)
                cb( null, err);
            else
//                cb({user: ctx.user, args, form_key, form_fields: doc.form_fields});
                cb(doc);
        });
    },


    rpc: {
        list_my_event_forms: function({ctx, args, cb}) {
//            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const {event_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;

            const query = {
                'form_key.user_id': user_id,
                'form_key.workflow_id': new mongoose.Types.ObjectId(workflow_id),
//                'form_key.workflow_id': workflow_id,
                'form_key.is_draft': true
            }

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
//            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const {event_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
            const form_key = {
                event_name, 
//                form_name, 
                role_name,
                workflow_id: mongoose.Types.ObjectId(workflow_id),
                user_id,
                is_draft: true
            };

            this.findOne({form_key}, (err, doc) => {
                if(err || !doc)
                    cb( null, err);
                else
                    cb({user: ctx.user, args, form_key, form_fields: doc.form_fields, form_name: doc.form_name});
            });
        },
        save_my_event_form_fields: function({ctx, args, cb}) {
//            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const {event_name, role_name, workflow_id} = args.form_meta;
            const {form_name, form_fields} = args;
            const user_id = ctx.user._id;
//            const form_key = {event_name, form_name, role_name,
            const form_key = {event_name, role_name,
                workflow_id: mongoose.Types.ObjectId(workflow_id),
                user_id, is_draft: true};

//            this.findOneAndUpdate({form_key}, {form_fields}, {
            this.findOneAndUpdate({form_key}, {form_fields, form_name}, {
                new: true,
                //strict: false,
                upsert: true // Make this update into an upsert
            }, (err, doc) => {
                if(err)
                    cb( null, err );
                else
                    cb({user: ctx.user, args, form_key, form_fields: doc.form_fields, form_name: doc.form_name});
            });
        },
        drop_my_event_form: function({ctx, args, cb}) {
//            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const {event_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ctx.user._id;
//            const form_key = {event_name, form_name, role_name,
            const form_key = {event_name, role_name,
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

});

module.exports = eventFormSchema;
