
const methods = {

  new_submission(args) {
    this.new_child_workflow('submission', args)
  },

//  new_registration({payload, ctx, cb}) {
  new_registration(args) {
    this.new_child_workflow('registration', args)
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
