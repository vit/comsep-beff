
const forms = {
  gn_paper: {
    title: {ru: 'Данные статьи', en: 'Paper data'},
    fields: [
        {name: 'title', type: 'text', label: {ru: 'Название', en: 'Title'} },
        {name: 'abstract', type: 'textarea', label: {ru: 'Аннотация', en: 'Abstract'} },
    ],
  }
}

module.exports = forms;
