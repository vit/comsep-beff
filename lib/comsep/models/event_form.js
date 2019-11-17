
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
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ct.user._id;
//            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};
//            const form_key = {role_name,  workflow_id, user_id, is_draft: true};
            const form_key = {user_id, is_draft: true};

//            const form_fields = {title: 'ttt', abstract: 'aaa'};
//            this.collection.drop();

            const query = {
                'form_key.user_id': user_id,
//                'form_key.workflow_id': new mongoose.Types.ObjectId(workflow_id),
//                'form_key.workflow_id': new mongoose.Types.ObjectId("5d8982517127c029d2785a00"),
//                'form_key.workflow_id': "5d8982517127c029d2785a00",
                'form_key.workflow_id': workflow_id,
                'form_key.is_draft': true
            }



            console.log("list_my_event_forms/query:", query);
//            console.log("list_my_event_forms/args:", args);
//            console.log("list_my_event_forms/workflow_id:", workflow_id);

            try {
//                const answer = await this.find({form_key});
//                const answer = await this.find({'form_key.user_id': user_id, 'form_key.is_draft': true});
//                const answer = await this.findOne(query);
//                const answer = await this.find(query);
/*
                const answer = await this.collection.find(query);
                console.log("list_my_event_forms/answer:", answer);
//                const answer = await this.find({form_key});
//                const answer = [1,2,3];
                cb(answer);
*/

///*
//                    this.collection.find(query, function(err, result) {
//                    this.collection.find(query, function(err, result) {
                    this.collection.find(query).toArray(function(err, result) {
                        console.log("list_my_event_forms/result:", result);
                        cb(result);
                    });
//*/

/*
                mongoose.connection.db.collection('event_form', function (err, collection) {
                    collection.find(query).toArray(function(err, result) {
                        console.log("list_my_event_forms/result:", result);
                        cb(result);
                    });
                });
*/

            }
            catch(err) {
                cb( null, err);
//                return;
            }
            
//            cb({user: ct.user, args});
        },
        get_my_event_form: async function({ct, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ct.user._id;
            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};

//            const form_fields = {title: 'ttt', abstract: 'aaa'};
//            this.collection.drop();

            console.log("get_my_event_form/form_key:", form_key);

            try {
                const doc = await this.findOne({form_key});
                cb({user: ct.user, args, form_key, form_fields: doc.form_fields});
            }
            catch(err) {
                cb( null, err);
//                return;
            }

        },
        save_my_event_form_fields: async function({ct, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ct.user._id;
            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};

            const {form_fields} = args;

            console.log("save_my_event_form_fields", form_key, form_fields);

            try {
//                const doc = await eventFormSchema.findOneAndUpdate(form_key, form_fields, {
                const doc = await this.findOneAndUpdate({form_key}, {form_fields}, {
                    new: true,
                    //strict: false,
                    upsert: true // Make this update into an upsert
                });
                cb({user: ct.user, args, form_key, form_fields: doc.form_fields});
            }
            catch(err) {
                console.log(err);
                cb( null, err );
                //return;
            }
        },
        drop_my_event_form: async function({ct, args, cb}) {
            const {event_name, form_name, role_name,  workflow_id} = args.form_meta;
            const user_id = ct.user._id;
            const form_key = {event_name, form_name, role_name,  workflow_id, user_id, is_draft: true};

            try {
                await this.deleteMany({form_key});
                cb({user: ct.user, args, form_key});
            }
            catch(err) {
                cb( null, err);
//                return;
            }
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
