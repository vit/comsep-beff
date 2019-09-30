
const schema = {
  initial: 'initial',
  roles: {
    admin: {
      events: {
        toggle: {
          transitions: [
            {from: 'initial', to: 'enabled', action: 'inc_cnt'},
            {from: 'enabled', to: 'initial', action: 'inc_cnt'},
            {from: 'done', to: 'initial', action: 'inc_cnt'},
          ]
        }
      }
    },
    user: {
      events: {
        toggle: {
          transitions: [
            {from: 'enabled', to: 'done', action: 'inc_cnt'},
          ]
        },
        submit: {
          transitions: [
            {from: 'initial', to: 'submitted', action: 'save_submitted'},
            {from: 'enabled', to: 'initial', action: 'inc_cnt'},
            {from: 'done', to: 'initial', action: 'inc_cnt'},
          ],
          accepts: {
            form: 'gn_paper',
          }
        }
      }
    }
  }
}

module.exports = schema;
