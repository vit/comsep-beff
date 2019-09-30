"use strict";

const machines = ['__ROOT__', '__JOURNAL__', '__LIBRARY__'];

const rez = {};

for(let name of machines) {
    const machine = require('./'+name+'/'+name);
    rez[name] = machine;
}

module.exports = rez;
