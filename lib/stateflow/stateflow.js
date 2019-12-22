
function methodsToArray(c) {
    if( !Array.isArray(c) ) {
        c = c ? [c] : [];
    }
    return c;
}

function def_system_queries(machine) {
    return {
        _what_can_i_do: function({payload, meta}, cb) {
            const schema = machine.get_schema_marked(this);
            const subschema = schema && schema.roles ? schema.roles[meta.role_name] : null;
            cb( subschema || {} );
        },
        _workflow_data: function({payload, meta}, cb) {
            cb( {data: this.data, cnt: this.cnt, state: this.state, app: this.app, ancestors: this.ancestors} );
//            return Promise.resolve( {data: this.data, cnt: this.cnt, state: this.state, app: this.app, ancestors: this.ancestors} );
        },
        _my_workflows: function({ctx, payload, meta}, cb) {
            ctx.models.Workflow.find({'ancestors.0': meta.workflow_id}, (err, items) => {
                cb({items}, err)
            });
        },
        _editor_workflows: function({ctx, payload, meta}, cb) {
//            console.log("_editor_workflows()")
            ctx.models.Workflow.find({'ancestors.0': meta.workflow_id}, (err, items) => {
                cb({items}, err)
            });
        },
        _reviewer_workflows: function({ctx, payload, meta}, cb) {
//            console.log("_reviewer_workflows()")
            ctx.models.Workflow.find({
                'ancestors.0': meta.workflow_id,
                'app': '__CONFERENCE_000__:submission'
            }, (err, items) => {
                cb({items}, err)
            });
        }
    }
}

class Machine {
    methods = {};
//    schema = {events: {}};
    schema = {roles: {}};
    forms = {};
    children = {};
    system_queries = {};
//    schema = {roles: {}};
//    constructor({methods}) {
//        this.methods = methods;
    constructor({schema, methods, forms, children}) {
        this.schema = schema || this.schema;
        this.schema.roles = this.schema.roles || {};
        this.methods = methods;
        this.forms = forms;
        this.children = children;
        this.system_queries = def_system_queries(this);
    }

    get_app_name() {
        return this.APP_NAME;
    }

    get_available_transitions_for_event(args) {
        let trs = [];
//        const {role, name, target, payload} = args;
        const {role_name, event_name, target, payload} = args;
        const role_schema = this.schema.roles[role_name];
        if(role_schema && role_schema.events) {
            const event_schema = role_schema.events[event_name];
            console.log("schema:", this.schema);
            console.log("event_schema:", event_schema);
            if(event_schema && event_schema.transitions && Array.isArray(event_schema.transitions)) {
                // from all known transitions for this event
                trs = event_schema.transitions.filter(
                    t => this.transition_is_available(t, target, this.methods, args)
//                        (t.from==target.state || !t.from) && // with appropriate "from" field
//                        this.eval_conditions(t.conditions, target, args)
                );
            }
        }
        return trs;
    }

//    process_event_with_target(target, args) {
    process_event_with_target(args) {
        let result = null;

//        const {ctx, target, payload, cb} = args;
        const {target, ctx, role_name, event_name, payload, cb} = args;
//        console.log("process_event_with_target()/args:", args);

        const tr = this.get_available_transitions_for_event( args )[0];
        console.log("process_event_with_target()/tr:", tr);

        if(tr) {
            target.state = tr.to;
//            result = this.apply_actions(target, tr.action, payload, ctx);
            this.apply_action(target, tr.action, payload, ctx, (result, error) => {
                target.save(function() {
                    cb(result, error);
                });
            });
        } else
            cb(null, `transitions for role '${role_name}' and event '${event_name}' not found`);
    }

    init_target(args) {
        let result = null;

//        const {target, ctx, role_name, event_name, payload, cb} = args;
        const {target, payload, ctx, cb} = args;

//        console.log("init_target()/args:", args);
//        console.log("init_target()/this.schema:", this.schema);

        if (this.schema && this.schema.init && this.schema.init.state)
            target.state = this.schema.init.state;

        if (this.schema && this.schema.init && this.schema.init.action) {
            this.apply_action(target, this.schema.init.action, payload, ctx, (result, error) => {
                target.save(function() {
                    cb(result, error);
                });
            });
        } else {
            target.save(function() {
                cb(result, null);
            });
//            cb(null, `transitions for role '${role_name}' and event '${event_name}' not found`);
        }
    }



    process_query_with_target(target, {ctx, query_name, payload, meta}, cb) {
//    process_query_with_target(target, {ctx, query_name, payload, meta}) {
        let result = null;

        let query_f = this.system_queries[query_name];
        if(query_f) {
            //result = query_f.call(target, {ctx, payload, meta});
            query_f.call(target, {ctx, payload, meta}, cb);
        } else {
            cb(null);
        }

/*
        const tr = this.get_available_transitions_for_event( args )[0];
        console.log(">>>>>");
//        console.log("target.machine_state before: ", target.machine_state);
        console.log("target.state before: ", target.state);
        console.log("transition: ", tr);
        if(tr) {
            target.state = tr.to;
            result = this.apply_actions(target, tr.action, args);
            console.log("result: ", result);
        }
//        console.log("target.machine_state after: ", target.machine_state);
        console.log("target.state after: ", target.state);
        console.log("<<<<<");

        target.save(function() {
            if(typeof cb == "function")
                cb({}, result);
        });
*/
        return result;
    }


    apply_action(target, action, payload, ctx, cb) {
//        let result;
        if(typeof action == "string")
            action = this.methods[action]
        if(typeof action == "function") {
            action.call(target, {payload, ctx, cb: (result, error) => {
                console.log('apply_action()/inside callback');
                cb(result);
            }});
//                cb({action_called: true});
            console.log('apply_action()/called');
        } else
            cb(null);
    }

/*
    apply_actions(target, action, payload, ctx) {
        let result;
        if(action) {
            const actions = methodsToArray(action);
            for(let action of actions) {
                if(typeof action == "function")
                    result = action.call(target, payload);
                else if(typeof action == "string") {
                    if(this.methods[action] && typeof this.methods[action]=='function')
                        result = this.methods[action].call(target, payload);
                }
            }
        }
        return result;
    }
*/

//    eval_conditions(conditions, target, action, args) {
    eval_conditions(conditions, target, args) {
        let result = true;
        if(conditions && Array.isArray(conditions))
            result = conditions.reduce( // where all conditions are computed to "true"
                (acc, c) => acc && c.call(target, args),
                true
            )
        return result;
    }

    transition_is_available(t, target, args) {
        const result =
            (t.from==target.state || !t.from) &&
            this.eval_conditions(t.conditions, target, args);
        return result;
    }



    get_transition_marked(t, target, args) {
        const {from, to, action} = t;
        const result = {from, to, action};
        result.available = this.transition_is_available(t, target, args);
        return result;
    }

    get_event_marked(e, target, args) {
        const result = {};
//        result.transitions = [];
        console.log("get_event_marked(), e", e);
        result.transitions = e.transitions ? e.transitions.map(
            t => this.get_transition_marked(t, target, args)
//            t => 123
        ) : [];
        result.title = e.title;
        result.available = result.transitions.reduce( (acc, t) => acc || t.available, false);
        return result;
    }

    get_role_marked(r, target, args) {
        const result = {};
        result.events = Object.keys(r.events).reduce(
            (acc, ei) => {
                acc[ei] = this.get_event_marked(r.events[ei], target, args);
                return acc;
            },
            {}
        );
        result.available = Object.keys(result.events).reduce(
            (acc, ei) => acc || result.events[ei].available,
            false
        );
        return result;
    }

//    get_schema_marked(target, args) {
    get_schema_marked(target) {
        const args = {};
        const result = {};

//        console.log("get_schema_marked()/target:", target);

        const schema = this.schema;

//        console.log("get_schema_marked()/schema:", schema);

        result.roles = Object.keys(schema.roles).reduce(
            (acc, ri) => {
                acc[ri] = this.get_role_marked(schema.roles[ri], target, args);
                return acc;
            },
            {}
        );
        result.available = Object.keys(result.roles).reduce(
            (acc, ri) => acc || result.roles[ri].available,
            false
        );
        return result;
    }



}

module.exports =  Machine;

