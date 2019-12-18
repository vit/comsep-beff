
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
          },
          title: {
            ru: 'Подать статью',
            en: 'Submit a paper'
          }
        },
      }
    },
    editor: {
      events: {
        drop_all: {
          transitions: [
            {from: 'initial', to: 'initial', action: 'drop_all'},
          ],
          accepts: {
            //form: 'gn_paper',
          },
          title: {
            ru: 'Очистить журнал',
            en: 'Clear the journal'
          }
        },
        edit_config: {
          transitions: [
            {from: 'initial', to: 'initial', aaction: ''},
          ],
          accepts: {
            //form: 'gn_paper',
          },
          title: {
            ru: 'Настроить параметры',
            en: 'Change config'
          }
        },
      }
    }
  }
}

module.exports = schema;
