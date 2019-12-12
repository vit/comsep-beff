const { readdirSync } = require('fs')


//const Machine = require('../../../../../stateflow/stateflow');
const Machine = require('../../../../stateflow/stateflow');

//const methods = require('./methods');

const methods = {

  init_me(args) {
    const {payload, ctx, cb} = args;
    console.log('init_me()/payload:', payload);
//    this.title = 'initialized';
//    this.title = JSON.stringify(payload);
    this.title = payload && payload.form && payload.form.form_fields ? payload.form.form_fields.title : '---';
    cb({}, null);
  },
}

//const schema = require('./schema');
const schema = {
//  initial: 'submitted',
  init: {
    state: 'submitted',
    action: 'init_me'
  },
  roles: {
/*
    __system__: {
      events: {
        create: {
          transitions: [
            {from: 'initial', to: 'submitted', action: 'init_me'},
          ]
        }
      }
    },
*/
    editor: {
      events: {
        to_reviewers: {
          transitions: [
            {from: 'submitted', to: 'on_review', aaction: 'to_reviewers'},
          ],
          accepts: {
            //form: 'gn_paper',
          },
          title: {
            ru: 'Передать рецензентам',
            en: 'To reviewers'
          }
        },
        accept: {
          transitions: [
            {from: 'on_review', to: 'accepted', aaction: ''},
          ],
          accepts: {
            //form: 'gn_paper',
          },
          title: {
            ru: 'Принять статью',
            en: 'Accept the paper'
          }
        },
        reject: {
          transitions: [
            {from: 'on_review', to: 'rejected', aaction: ''},
          ],
          accepts: {
            //form: 'gn_paper',
          },
          title: {
            ru: 'Отклонить статью',
            en: 'Reject the paper'
          }
        },
      }
    }
  }
}



const machine = new Machine({
  methods,
  schema,
  forms: {

  }
});


module.exports = machine;

