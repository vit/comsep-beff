

const sqlite3 = require('sqlite3').verbose();

function reload_all(fastify) {

    const UserModel = fastify.mongoose.User;
    const WorkflowModel = fastify.mongoose.Workflow;
    const EventFormModel = fastify.mongoose.EventForm;
    const LibItemModel = fastify.mongoose.LibItem;

    UserModel.deleteMany({}, function (err) {
      if (err)
        console.log(err);
      else {
        const db = new sqlite3.Database("/opt/common-data/gn/production.sqlite3");
        db.each("SELECT * FROM users", function(err, row) {
//          console.log("row: ", row);
          const {id, email, encrypted_password, fname, mname, lname} = row;
    //      const userData = {gn_pin: id, email, encrypted_password, name: {fname, mname, lname}};
          const userData = {gn_pin: id, email, encrypted_password, fname, mname, lname};
          const user = new UserModel( userData );
          user.save(function (err) {
//            console.log("_id:", user._id, "fullName: ", user.fullName());
          });
        });
        db.close();
      }
      //reply.send({ ok: true });
    });

    WorkflowModel.deleteMany({}, function (err) {
      if (err)
        console.log(err);
      else {

        WorkflowModel.create({
          slug: '__ROOT__',
          state: "initial",
          app: "__ROOT__",
          cnt: 0,
          title: "Root Workflow"
        }, function (err, rez) {
        });

        WorkflowModel.create({
          slug: 'gn',
          state: "initial",
          app: "__JOURNAL__",
          cnt: 0,
          title: "GN Journal Workflow"
        }, function (err, rez) {
        });

        WorkflowModel.create({
          slug: 'lib',
          state: "initial",
          app: "__LIBRARY__",
          cnt: 0,
          title: "Library Workflow"
        }, function (err, rez) {
        });

        WorkflowModel.create({
          slug: 'icins-2020',
          state: "initial",
          app: "__CONFERENCE_000__",
          cnt: 0,
          title: "ICINS 2020"
        }, function (err, rez) {
        });

      }
    });

    EventFormModel.deleteMany({}, function (err) {
      if (err)
        console.log(err);
      else {
      }
    });

    LibItemModel.deleteMany({}, function (err) {
      if (err)
        console.log(err);
      else {

        LibItemModel.create({
            title: 'Конференции',
            abstract: 'Каталог с материалами конференций',
            type: 'dir',
            parent: null
        }, function (err, rez) {
        });

        LibItemModel.create({
            title: 'Журнал',
            abstract: 'Каталог со статьями журнала',
            type: 'dir',
            parent: null
        }, function (err, journal) {
//            console.log(journal);
            if (err)
                console.log(err);
            else {
                const testPaper = LibItemModel.create({
                    title: 'Test Paper',
                    abstract: 'Test Paper Abstract',
                    type: 'doc',
                    parent: journal._id
                }, function (err, rez) {
                });

                const db = new sqlite3.Database("/opt/common-data/gn/production.sqlite3");
                db.each("SELECT * FROM submission_revisions as r join submission_texts as t on r.id=t.submission_revision_id where r.aasm_state='accepted' ", function(err, row) {
//                  console.log("row: ", row);
                  let {title, abstract} = row;
                  title = title || '???';
                  abstract = abstract || '???';
                  title = shuffleWords(title);
                  abstract = shuffleWords(abstract);

                  LibItemModel.create({
                      title,
                      abstract,
                      type: 'doc',
                      parent: journal._id
                  }, function (err, rez) {
                  });

                });
                db.close();



            }
        });

      }
    });

}

module.exports = {
    reload_all
}

function shuffleWords(s) {
    const a = s.split(' ');
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join(' ');
}
