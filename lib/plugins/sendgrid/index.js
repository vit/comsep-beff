"use strict";

const fastifyPlugin = require("fastify-plugin");

async function sendgridConnector(
    fastify,
    { api_key }
) {

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(api_key);

    const decorator = { sgMail };

    fastify.decorate("sendgrid", decorator);
}

module.exports = fastifyPlugin(sendgridConnector);
