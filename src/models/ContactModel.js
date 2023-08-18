const mongoose = require('mongoose');
const validator = require('validator');
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  number: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },

});
const ContactModel = mongoose.model('Contact', ContactSchema);
class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }
  validator() {
    this.cleanData();
    if (!validator.isEmail(this.body.email)) this.errors.push('Invalid E-mail')
    if (this.body.number <= 3) this.errors.push('Number must Contain more than 4 characteres')
    if (this.body.name <= 1) this.errors.push('Name must Contain more than 1 characteress')
    if (!this.body.number && !this.body.email) this.errors.push('Must Contain at least e-mail or contact number')
  }
  static async findById(id) {
    if (typeof id !== 'string') return;


    const user = await ContactModel.findById(id);
    return user;
  }


  async register() {
    this.validator();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(
      {
        name: this.body.name,
        email: this.body.email,
        number: this.body.number
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
      name: this.body.name,
      email: this.body.email,
      number: this.body.password,
    }
  }
}
module.exports = Contact;