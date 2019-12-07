'use strict'

const Machine = require('../../../stateflow/stateflow');

const methods = require('./methods');
const schema = require('./schema');
const forms = require('./forms');


const { readdirSync } = require('fs')

function trim_ext(name) {
  return name.split('.').slice(0, -1).join('.')
}

function load_children(children_base) {
  const children = {};
  readdirSync(children_base, { withFileTypes: true }).forEach(dirent => {
    let name = dirent.name;
    if( dirent.isDirectory() ) {
      children[name] = require(children_base+'/'+name+'/'+name)
    } else {
      name = trim_ext(name)
      children[name] = require(children_base+'/'+name)
    }
  })
  return children;
}

const children = load_children(__dirname+'/children')
console.log("children:", children);


const machine = new Machine({
  methods,
  schema,
  forms,
  children
});

module.exports = machine;

