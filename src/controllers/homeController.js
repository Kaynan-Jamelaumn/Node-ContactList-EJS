const Contact = require('../models/ContactModel');
exports.index = async (req, res) => {
  const contacts = await Contact.findContacts(req.session.user._id);
  res.render('index', { contacts: contacts });
  return;
};
