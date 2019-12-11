
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
            form: 'conf_paper',
          },
          title: {
            ru: 'Подать статью',
            en: 'Submit a paper'
          }
        },
        create_new_registration: {
          transitions: [
            {from: 'initial', to: 'initial', action: 'new_registration'},
          ],
          accepts: {
            form: 'conf_registration',
          },
          title: {
            ru: 'Зарегистрироваться для участия',
            en: 'Register for participation'
          }
        },
        take_over_the_world: {
          title: {
            ru: 'Захватить мир',
            en: 'Take over the world'
          }
        }
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
            ru: 'Удалить здесь все данные',
            en: 'Delete all data here'
          }
        }
      }
    }
  }
}

module.exports = schema;
