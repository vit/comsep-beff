
const forms = {
  conf_paper: {
    title: {ru: 'Данные статьи', en: 'Paper data'},
    fields: [
        {name: 'title', type: 'text', label: {ru: 'Название', en: 'Title'} },
        {name: 'abstract', type: 'textarea', label: {ru: 'Аннотация', en: 'Abstract'} },
    ],
  },
  conf_registration: {
    title: {ru: 'Регистрационная форма', en: 'Registration form'},
    fields: [
        {name: 'lname', type: 'text', label: {ru: 'Фамилия', en: 'Last name'} },
        {name: 'fname', type: 'text', label: {ru: 'Имя', en: 'First name'} },
        {name: 'mname', type: 'text', label: {ru: 'Отчество', en: 'Middle name'} },
        {name: 'occupation', type: 'textarea', label: {ru: 'Занятие', en: 'Occupation'} },
    ],
  },
  conf_review: {
    title: {ru: 'Рецензия', en: 'Review'},
    fields: [
        {name: 'comments_for_editor', type: 'textarea', label: {ru: 'Комментарий для редактора', en: 'Comments for editor'} },
        {name: 'comments_for_author', type: 'textarea', label: {ru: 'Комментарий для автора', en: 'Comments for author'} },
    ],
  },
}

module.exports = forms;
