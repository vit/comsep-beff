"use strict";

const fastifyPlugin = require("fastify-plugin");
const mongoose = require("mongoose");


async function mongooseConnector(
    fastify,
    { uri, settings = {}, models = [], useNameAndAlias = false }
) {
    await mongoose.connect(
        uri,
        Object.assign(settings, {useNewUrlParser: true})
    );

    const decorator = {
        instance: mongoose
    };

    if (models.length !== 0) {
        models.forEach(model => {
            const alias = model.alias ? model.alias : `${model.name[0].toUpperCase()}${model.name.slice(1)}`;
            decorator[alias] = mongoose.model(
                alias,
                model.schema,
                model.name
            );
        });
    }

    fastify.decorate("mongoose", decorator);
    fastify.addHook('onClose', function (fastify, done) {
        mongoose.connection.close(done);
    });
}

module.exports = fastifyPlugin(mongooseConnector);
