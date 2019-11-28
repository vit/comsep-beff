
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
//    this.cnt++;
//    console.log('new_submission()');

/*
    this.new_workflow({type: 'submission'}, (result, error) => {
      console.log('new_submission()/new_workflow/cb:', result);
      cb(result, error);
//      cb({from_inside_action: true});
    });
*/

    ctx.models.Workflow.create_workflow({type: 'submission', current_workflow: this, payload}, (result, error) => {
      console.log('new_submission()/create_workflow/cb:', result);
      cb(result, error);
    });


//    cb({from_inside_action: true});
  }
}

module.exports = methods;
