//"use strict";


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require('./user');
const workflowSchema = require('./workflow');
const eventFormSchema = require('./event_form');

const ObjectId = mongoose.Schema.Types.ObjectId;

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
        name: "workflow",
        alias: "Workflow",
        schema: workflowSchema
    }
];
