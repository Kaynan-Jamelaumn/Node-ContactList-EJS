const User = require('../models/UserModel');

exports.login = async (req, res) => {
  if (req.method === 'GET') {
    res.render('auth/login');
  }
  else if (req.method === 'POST') {
    const user = new User(req.body);
    try {
      await user.login();

      if (user.errors.length > 0) {
        req.flash('errors', user.errors);
        req.session.save(() => {
          return res.redirect('/auth/login');
        });
        return;
      }


      req.flash('success', 'Login successful');
      req.session.user = user.user;
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch (e) {
      console.log(e);
      res.render('404');
    }
  }
};

exports.logout = (req, res) => {
  if (req.method === 'GET') {
    req.session.user = null;
    req.session.save(() => {
      return res.redirect('/auth/login');
    });
  }
};
exports.signup = async (req, res) => {
  if (req.method === 'GET') {
    res.render('auth/signup');
  } else if (req.method === 'POST') {
    const user = new User(req.body);
    try {
      await user.register();

      if (user.errors.length > 0) {
        req.flash('errors', user.errors);
        req.session.save(() => {
          return res.redirect('/auth/signup');
        });
        return;
      }
      req.flash('success', 'Account made');
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch (e) {
      console.log(e);
      res.render('404');
    }
  }
};
