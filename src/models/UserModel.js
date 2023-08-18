const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true }

});
const UserModel = mongoose.model('User', UserSchema);
class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.loginValidator();
    if (this.errors.length > 0) return;
    this.user = await UserModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push("Invalid E-mail or passowrd");
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Invalid E-mail or passowrd");
      this.user = null;
      return;
    }

  }
  loginValidator() {
    if (!validator.isEmail(this.body.email)) this.errors.push('Invalid E-mail')
    if (this.body.password <= 3) this.errors.push('Must Contain more than 4 characteres')
  }

  validator() {
    this.cleanData();
    if (!validator.isEmail(this.body.email)) this.errors.push('Invalid E-mail')
    if (this.body.password <= 3) this.errors.push('Password must Contain more than 4 characteres')
    if (this.body.password !== this.body.passwordConfirmation) this.errors.push("Passwords Doesnt Match")
    if (this.body.name <= 1) this.errors.push('Name must Contain more than 1 characteress')
  }
  async register() {
    this.validator();
    if (this.errors.length > 0) return;

    await this.userExists()

    if (this.errors.length > 0) return;
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await UserModel.create(
      {
        name: this.body.name,
        email: this.body.email,
        password: this.body.password
      }
    );
  }
  cleanData() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
      passwordConfirmation: this.body.passwordConfirmation,
      name: this.body.name
    }
  }

  async userExists(reverse) {
    const userDoesExist = await UserModel.findOne({ email: this.body.email });
    if (userDoesExist) this.errors.push('User already Exixts');

  }
}
module.exports = User;