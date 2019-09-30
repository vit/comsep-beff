
const methods = {
  inc_cnt({target, user}) {
    console.log("Do something with target object", this);
    this.cnt++;
    return "ok";
  }
}

module.exports = methods;
