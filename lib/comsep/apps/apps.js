"use strict";

const machines = ['__ROOT__', '__JOURNAL__', '__LIBRARY__'];

const apps_list = {};

for(let name of machines) {
    const machine = require('./'+name+'/'+name);
    machine.APP_NAME = name;
    apps_list[name] = machine;
}

module.exports = {
    get_by_name(name) {
        let result;
        const name_parts = name.split(':')
        console.log("get_by_name()/name:", name);
        console.log("get_by_name()/name_parts:", name_parts);
        const app_name = name_parts.shift()
        const child_name = name_parts.shift()
        console.log("get_by_name()/app_name:", app_name);
        console.log("get_by_name()/child_name:", child_name);
        let elm = apps_list[app_name];
        console.log("get_by_name()/elm:", elm);
        console.log("get_by_name()/elm.children:", elm.children);
        if(child_name) {
            result = (elm && elm.children) ? elm.children[child_name] : null
        } else {
            result = elm;
        }
        console.log("get_by_name()/result:", result);
        return result;
//        return apps_list[name];
    }
};
