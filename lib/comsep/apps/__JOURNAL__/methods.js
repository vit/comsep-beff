
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
    cb({from_inside_action: true});
    console.log('new_submission()');
  }
}

module.exports = methods;
