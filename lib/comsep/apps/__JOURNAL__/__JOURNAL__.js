
const Machine = require('../../../stateflow/stateflow');

const methods = require('./methods');
const schema = require('./schema');

const machine = new Machine({
  methods,
  schema,
  forms: {
    gn_paper: {
      title: 'Данные статьи',
//      onSubmit: this.onSubmit, 
//      data: this.formData,
      fields: [
          {name: 'title', type: 'text', label: 'Название'},
          {name: 'abstract', type: 'textarea', label: 'Аннотация'},
      ],
    }
  }
});


/*

machine.define_role({
  name: "admin",
  events: {
    toggle: {
      transitions: [
        {from: 'initial', to: 'enabled', action: 'inc_cnt'},
        {from: 'enabled', to: 'initial', action: 'inc_cnt'},
      ]
    };
  }
});

machine.define_role({
  name: "author",
  conditions: ({user}) => user.role=="author",
  events: {
    toggle: {
      transitions: [
        {from: 'created', to: 'submitted',
          action: ({target, user}) => {
              console.log("Do something with target object", target);
              return "ok";
          }
        },
        {from: 'submitted', to: 'created',
          action: ({target, user}) => console.log("Do more with target object", target)
        },
      ]
    }
  }
});

machine.define_role({
  name: "editor",
  conditions: ({user}) => user.role=="editor",
  events: {
    toggle: {
      transitions: [
        {from: 'created', to: 'submitted'},
        {from: 'submitted', to: 'created'},
      ]
    }
  }
});

*/


module.exports = machine;

