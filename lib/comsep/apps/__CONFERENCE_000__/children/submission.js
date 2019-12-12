const { readdirSync } = require('fs')


//const Machine = require('../../../../../stateflow/stateflow');
const Machine = require('../../../../stateflow/stateflow');

//const methods = require('./methods');

const methods = {

  init(args) {
    const {payload, ctx, cb} = args;
    console.log('init()/payload:', payload);
    this.title = 'initialized';
/*
    ctx.models.Workflow.create_workflow({type: 'submission', current_workflow: this, payload}, (result, error) => {
      console.log('new_submission()/create_workflow/cb:', result);

      const form_id = payload && payload.form && payload.form._id;
      if(form_id) {
        ctx.models.EventForm.findOne(form_id, (error, form) => {
          console.log('new_submission()/findOne/:(form, error)', form, error);
          form.submit({}, () => {
            cb(result, error);
          })
        });
      } else {
        cb(result, error);
      }
//      cb(result, error);
    });
*/
    cb({}, null);
  },
}

//const schema = require('./schema');
const schema = {
//  initial: 'submitted',
  init: {
    state: 'submitted',
    action: 'init'
  },
  roles: {
    __system__: {
      events: {
        create: {
          transitions: [
            {from: 'initial', to: 'submitted', action: 'init'},
          ]
        }
      }
    },
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

