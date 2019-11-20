//"use strict";


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require('./user');
const workflowSchema = require('./workflow');
const eventFormSchema = require('./event_form');

const ObjectId = mongoose.Schema.Types.ObjectId;

const docSchema = new Schema({
    meta: {
        ownerId: ObjectId,
        roleName: String,
        contextId: ObjectId,
        eventName: String,
        formName: String
    },
    doc: {}
});

docSchema.static({
    getDoc: async function({docMeta}, cb) {
        const filter = { meta: docMeta };

        console.log("getDoc()", docMeta);

///*
        try {
            const doc = await this.findOne(filter);
            console.log("getDoc()/found", doc);
            cb( null, doc );
        }
        catch(err) {
            console.log("getDoc()/catch", err);
            cb( err, null );
            return;
        }
//*/
        cb( null, null );

    },
    saveDoc: async function({docMeta, formData}, cb) {
        const filter = { meta: docMeta };
        const update = { doc: formData };
    
        console.log("saveDoc()", docMeta, formData);

        //await this.deleteMany({});

///*
        try {
            const doc = await this.findOneAndUpdate(filter, update, {
                new: true,
                //strict: false,
                upsert: true // Make this update into an upsert
            });
            console.log("saveDoc()/saved", doc);
            cb( null, doc );
        }
        catch(err) {
            console.log("saveDoc()/catch", err);
            cb( err, null );
            return;
        }
//*/
        cb( null, null );

    },
    listDocs: async function({docMeta}, cb) {
//        const filter = { meta: docMeta };
//        const filter = { meta: {
//            $elemMatch: docMeta
//        }};
//        const filter = { meta: {} };
//        const filter = { };

        console.log("listDocs()/meta", docMeta);
        console.log("listDocs()/contextId", mongoose.Types.ObjectId(docMeta.contextId));
        console.log("listDocs()/contextId", docMeta.contextId);

//        const filter = { 'meta.contextId': mongoose.Types.ObjectId(docMeta.contextId) };
//        const filter = { 'meta.contextId': docMeta.contextId };
//        const filter = { 'meta.contextId': "5d8982517127c029d2785a00" };
//        const filter = { 'meta.contextId': mongoose.Types.ObjectId('5d8982517127c029d2785a00') };
        const filter = { 'meta.eventName': 'new_submission' };

        console.log("listDocs()/filter", filter);
    
        const docs = await this.find(filter);
//        const docs = await this.find({});

        console.log("listDocs()/data", docs);
        cb( null, docs );
    },
});



module.exports = [
    {
        name: "libitem",
        alias: "LibItem",
        schema: new Schema({
            title: String,
            abstract: String,
            type: String,
            parent: ObjectId
        })
    },
    {
        name: "doc",
        alias: "Doc",
        schema: docSchema
    },

    {
        name: "event_form",
        alias: "EventForm",
        schema: eventFormSchema
    },

    {
        name: "user",
        alias: "User",
        schema: userSchema
    },
    {
        name: "test",
        alias: "Test",
        schema: new Schema({
            a: {type: String}
        })
    },
    {
        name: "workflow",
        alias: "Workflow",
        schema: workflowSchema
    }
];
