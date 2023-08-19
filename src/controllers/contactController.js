
const Contact = require('../models/ContactModel');
exports.register = async (req, res) => {
  if (req.method === 'GET') {
    res.render('contact/register');
  }
  else if (req.method === 'POST') {
    const contact = new Contact(req.body);
    try {
      await contact.register(req.session.user._id);

      if (contact.errors.length > 0) {
        req.flash('errors', contact.errors);
        req.session.save(() => {
          return res.redirect(`/contact/register`);
        });
        return;
      }
      req.flash('success', 'Contact made');
      req.session.save(() => {
        return res.redirect(`/`);
      });
    } catch (e) {
      console.log(e);
      res.render('404');
    }
  }
}

exports.update = async (req, res) => {
  if (req.method === 'GET') {
    if (!req.params.id) return res.render('404');
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.render('404');
    res.render('contact/update', { contact: contact });
  }
  else if (req.method === 'POST') {
    const contact = new Contact(req.body);
    try {
      await contact.update(req.params.id);
      if (contact.errors.length > 0) {
        req.flash('errors', contact.errors);
        req.session.save(() => {
          return res.redirect(`/contact/update/${req.params.id}`);
        });
        return;
      }
      req.flash('success', 'Contact updated');
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch (e) {
      console.log(e);
      res.render('404');
    }
  }
}



exports.delete = async (req, res) => {
  if (req.method === 'GET') {
    if (!req.params.id) return res.render('404');
    try {
      await Contact.delete(req.params.id, req.session.user._id);
      req.flash('success', 'Contact deleted');
      req.session.save(() => {
        return res.redirect('/')
      });
    }
    catch {
      req.flash('errors', 'Failed to find or delete the contact');
      req.session.save(() => {
        return res.redirect('/')
      });
    }
  }

}