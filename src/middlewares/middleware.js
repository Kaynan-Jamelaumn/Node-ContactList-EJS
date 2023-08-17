exports.middleWareGlobal = (req, res, next) => {
  console.log(" sou o middleware passei");
  next();
}

exports.checkCSRFError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.send('BAD CSRF');
  }
}
exports.CSRFMiddleware = (req, res, next) => {
  res.locals.csrftoken = req.csrfToken(); // Use req.csrfToken() here
  next();
}
