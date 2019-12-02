
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
        create_new_submission: {
          transitions: [
            {from: 'initial', to: 'initial', action: 'new_submission'},
          ],
          accepts: {
            form: 'gn_paper',
          }
        },
        drop_all: {
          transitions: [
            {from: 'initial', to: 'initial', action: 'drop_all'},
          ],
          accepts: {
            //form: 'gn_paper',
          }
        }
      }
    }
  }
}

module.exports = schema;
