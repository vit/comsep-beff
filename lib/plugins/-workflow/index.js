"use strict";

const fastifyPlugin = require("fastify-plugin");
const apps = require("../../comsep/apps");


async function workflowLoader(
    fastify,
    {}
) {
    fastify.decorate("apps", apps);
}

module.exports = fastifyPlugin(workflowLoader);
