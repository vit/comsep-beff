
function methodsToArray(c) {
    if( !Array.isArray(c) ) {
        c = c ? [c] : [];
    }
    return c;
}

function def_system_queries(machine) {
    return {
        _what_can_i_do: function({payload, meta}) {
            console.log("_what_can_i_do():", {
                name: "_what_can_i_do answer",
                payload,
                meta
            });
            console.log("_what_can_i_do() -- this:", this);
//            const schema = this.machine.get_schema_marked(target);
//            const schema = this.machine.get_schema_marked(this);
            const schema = machine.get_schema_marked(this);
            const subschema = schema && schema.roles ? schema.roles[meta.user_role] : null;
            console.log("_what_can_i_do() -- subschema:", subschema);
            return subschema;
//            return this.machine.get_schema_marked(target);
//            return target.machine_state.get_schema_marked(target);
//            return target;
        },
        _workflow_data: function({payload, meta}) {
            console.log("_workflow_data():", {
                name: "_workflow_data answer",
                payload,
                meta
            });
            console.log("_workflow_data() -- this:", this);
            return {wf: this}
//            const schema = machine.get_schema_marked(this);
//            const subschema = schema && schema.roles ? schema.roles[meta.user_role] : null;
//            console.log("_workflow_data() -- subschema:", subschema);
//            return subschema;
        }
    }
}

class Machine {
    methods = {};
//    schema = {events: {}};
    schema = {roles: {}};
    forms = {};
    system_queries = {};
//    schema = {roles: {}};
//    constructor({methods}) {
//        this.methods = methods;
    constructor({schema, methods, forms}) {
        this.schema = schema;
        this.methods = methods;
        this.forms = forms;
        this.system_queries = def_system_queries(this);
    }

    get_available_transitions_for_event(args) {
        let trs = [];
        const {role, name, target, payload} = args;
        const role_schema = this.schema.roles[role];
        if(role_schema && role_schema.events) {
            const event_schema = role_schema.events[name];
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

//    process_query_with_target(target, args={}, cb) {
    process_query_with_target(target, {query_name, payload, meta}, cb) {
        let result = null;
//        args.target = target;
//        const {user, role, name, payload} = args;

        let query_f = this.system_queries[query_name];
        if(query_f) {
//            result = query_f.apply(target, payload);
            result = query_f.call(target, {payload, meta});
        }

//        result = {r: 'qqqwwweee', payload, meta};

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

    apply_actions(target, action, args) {
        let result;
        if(action) {
            const actions = methodsToArray(action);
            for(let action of actions) {
                if(typeof action == "function")
                    result = action.call(target, args);
                else if(typeof action == "string") {
                    if(this.methods[action] && typeof this.methods[action]=='function')
                        result = this.methods[action].call(target, args);
                }
            }
        }
        return result;
    }

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
        const schema = this.schema;
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

