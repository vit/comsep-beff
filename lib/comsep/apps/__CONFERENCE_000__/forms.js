
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
  }
}

module.exports = forms;
