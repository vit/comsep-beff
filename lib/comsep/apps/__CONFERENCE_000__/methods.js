
const methods = {

  inc_cnt({target, user}) {
    console.log("Do something with target object", this);
    this.cnt++;
    return "ok";
  },

  save_submitted({target, user}) {
    return "ok";
  },

  new_submission(args) {
    this.new_child_workflow('submission', args)
  },

//  new_registration({payload, ctx, cb}) {
  new_registration(args) {
    this.new_child_workflow('registration', args)
/*
    console.log('new_registration()/payload:', payload);

    ctx.models.Workflow.create_workflow({type: 'registration', current_workflow: this, payload}, (result, error) => {
      console.log('new_registration()/create_workflow/cb:', result);

      const form_id = payload && payload.form && payload.form._id;
      if(form_id) {
        ctx.models.EventForm.findOne(form_id, (error, form) => {
          console.log('new_registration()/findOne/:(form, error)', form, error);
          form.submit({}, () => {
            cb(result, error);
          })
        });
      } else {
        cb(result, error);
      }
    });

//    cb({}, null);
*/

  },

  drop_all({payload, ctx, cb}) {
    ctx.models.Workflow.deleteMany({ancestors: this._id}, (error) => {
      console.log('drop_all()/Workflow/deleteMany()/error:', error);
      cb(null, error);
    });

//    const user_id = ctx.user._id;
    const query = {
//      'form_key.user_id': user_id,
//      'form_key.workflow_id': new mongoose.Types.ObjectId(this._id),
      'form_key.workflow_id': this._id,
//      'form_key.is_draft': true
    }

    ctx.models.EventForm.deleteMany(query, (error) => {
      console.log('drop_all()/EventForm/deleteMany()/error:', error);
      cb(null, error);
    });
  }

}

module.exports = methods;
