
const mongoose = require('mongoose');
const validator = require('validator');
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  number: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },

});
const ContactModel = mongoose.model('Contact', ContactSchema);
class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }

  static async findById(id) {
    if (typeof id !== 'string') return;
    const contact = await ContactModel.findById(id);
    return contact;
  }

  static async findContacts(userId) {
    const contacts = await ContactModel.find({ user_id: userId }).sort({ createdAt: -1 });
    return contacts;
  }

  async register(userId) {
    this.validator();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(
      {
        name: this.body.name,
        email: this.body.email,
        number: this.body.number,
        user_id: userId
      }
    );
  }
  async update(id) {
    this.validator();
    if (this.errors.length > 0) return;

    const contact = await ContactModel.findById(id);
    if (!contact) {
      this.errors.push('Contact not found');
      return;
    }

    contact.name = this.body.name;
    contact.email = this.body.email;
    contact.number = this.body.number;

    await contact.save();
    console.log("josx", contact);
    this.contact = contact;
  }

  static async delete(id, userId) {
    if (typeof id !== 'string') {
      this.errors.push('Invalid contact ID');
      return;
    }
    const contact = await ContactModel.findOne({ _id: id, user_id: userId });
    if (!contact) {
      this.errors.push('Contact not found or does not belong to the user');
      return;
    }
    await ContactModel.deleteOne({ _id: id, user_id: userId }); // Use deleteOne or findByIdAndDelete
  }


  validator() {
    this.cleanData();
    if (!this.body.number && !this.body.email) this.errors.push('Must Contain at least e-mail or contact number')
    if ((!this.body.email && !this.body.number) && !validator.isEmail(this.body.email)) this.errors.push('Invalid E-mail')
    if (this.body.name <= 1) this.errors.push('Name must Contain more than 1 characteress')
  }


  cleanData() {
    console.log(this.body.number)
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      name: this.body.name,
      email: this.body.email,
      number: this.body.number,
    }
  }
}
module.exports = Contact;