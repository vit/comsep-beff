
const schema = {
  initial: 'initial',
//  initial: 'active',
  roles: {
    admin: {
      events: {
        toggle: {
          transitions: [
          ]
        }
      }
    },
    user: {
      events: {
        submit_new_paper: {
          transitions: [
            {from: 'initial', to: 'initial', action: 'submit_new'},
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
