
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
    this.cnt++;
    console.log('new_submission()');

    this.new_workflow({name: 'submission'});

    cb({from_inside_action: true});
  }
}

module.exports = methods;
