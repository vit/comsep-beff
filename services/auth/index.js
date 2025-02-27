'use strict'

const bcrypt = require('bcrypt');

module.exports = async function (fastify, opts) {

/*
  fastify.get('/auth/test_email', async (request, reply) => {
    const sgMail = fastify.sendgrid.sgMail;
      const msg = {
        to: 'shiegin@gmail.com',
        from: 'anud@bigbrowser.ru',
        templateId: process.env.USER_REGISTERED_TEMPLATE,
          dynamic_template_data: {
              full_name: 'Vitaliy Shiegin',
          },
      };
      try {
        await sgMail.send(msg);
      }
      catch(err) {
        console.log("MailError", err);
      }
    reply.send({ ok: true });
  })
*/

  fastify.get('/auth/drop_users', (request, reply) => {
    console.log("/auth/drop_users");
    const UserModel = fastify.mongoose.User;

    UserModel.deleteMany({}, function (err) {
      if (err)
        console.log(err);
    });
    reply.send({ ok: true });
  })

  fastify.get('/auth/reset_all', (request, reply) => {
    console.log("/auth/reset_all");

    const importer = require('../../lib/import');
    importer.reload_all(fastify);

    reply.send({ ok: true });

  })

  fastify.post('/auth/register', (request, reply) => {
    console.log("/auth/register");
    console.log(request.body);
    const UserModel = fastify.mongoose.User;

//    const email = request.body.email.replace(/\s/g, '');
    const {fname, mname, lname, email, password, repeat_password} = request.body;

    if( !lname || lname.length == 0 ) {
      reply.send({ token: null, msg: "lname_not_set" });
      return;
    }

    if( !fname || fname.length == 0 ) {
      reply.send({ token: null, msg: "fname_not_set" });
      return;
    }

    if( !email || email.length == 0 ) {
      reply.send({ token: null, msg: "email_not_set" });
      return;
    }

    if( !password || password.length == 0 ) {
      reply.send({ token: null, msg: "password_not_set" });
      return;
    }

    if( password != repeat_password ) {
      reply.send({ token: null, msg: "passwords_not_equal" });
      return;
    }

    const encrypted_password = bcrypt.hashSync(password, 10);
    const userData = {fname, mname, lname, email, encrypted_password};
    const user = new UserModel( userData );
    user.save(function (err) {
      console.log("_id:", user._id, "fullName: ", user.fullName());
      console.log("err:", err);
      if(err)
        reply.send({ token: null, msg: err.errmsg });
      else {

        const msg = {
          to: email,
          from: process.env.FROM_EMAIL,
          templateId: process.env.USER_REGISTERED_TEMPLATE,
            dynamic_template_data: {
                full_name: user.fullName(),
            },
        };
        try {
          fastify.sendgrid.sgMail.send(msg);
        }
        catch(err) {
        //  console.log("MailError", err);
        }

        const userData = {id: user._id, fname, mname, lname};
        const token = fastify.jwt.sign({ user: userData });
        console.log(token);
        reply.send({ token, msg: "ok" })
//        reply.send({ token: null, msg: "ok" });
      }
    });

  })

  fastify.post('/auth/login', (request, reply) => {
    console.log("/auth/login");
    console.log(request.body);
    const UserModel = fastify.mongoose.User;

    const email = request.body.email;

    UserModel.findOne({email: email}, function(err, row) {
        if(row) {
          console.log("row: ", row);
          const hash = row.encrypted_password;
          console.log("hash: ", hash);

          bcrypt.compare(request.body.password, hash, function(err, match) {
            console.log("match: ", match);
            if(match) {
//              const {_id, name} = row;
//              const user = {id: _id, name};
              const {_id, fname, mname, lname} = row;
              const user = {id: _id, fname, mname, lname};
              const token = fastify.jwt.sign({ user });
              console.log(token);
              reply.send({ token, msg: "ok" })
            } else {
              reply.send({ token: null, msg: "wrong_password" })
            }
          });


        } else {
          reply.send({ token: null, msg: "email_not_found" })
        }
      });

  })

  fastify.get('/auth/users', (request, reply) => {
    console.log("/auth/users");
    const UserModel = fastify.mongoose.User;

    UserModel.find({}, function(err, users) {
        if(users) {

          reply.send({
            err: false,
            users: users.map(function(u) {
              const {_id, gn_pin} = u;
              return {_id, gn_pin, fullName: u.fullName()};
            })
          })

        } else {
          reply.send({ err: true })
        }
      });

  })

  fastify.post('/auth/logout', function (request, reply) {
    reply.send({
      ok: true
    })
  })

}

