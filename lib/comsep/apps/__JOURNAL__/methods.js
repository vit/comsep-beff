
const methods = {

  inc_cnt({target, user}) {
    console.log("Do something with target object", this);
    this.cnt++;
    return "ok";
  },

  save_submitted({target, user}) {
    return "ok";
  },

  new_submission({payload, ctx, cb}) {
    ctx.models.Workflow.create_workflow({type: 'submission', current_workflow: this, payload}, (result, error) => {
      console.log('new_submission()/create_workflow/cb:', result);
      cb(result, error);
    });
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
