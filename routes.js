const express = require('express');
const route = express.Router();
const app = express();
const { loginRequired } = require('./src/middlewares/middleware');

const homeController = require('./src/controllers/homeController');
const authController = require('./src/controllers/authController')
const contactController = require('./src/controllers/contactController')
route.get('/', homeController.index)

route.get('/contact/register', loginRequired, contactController.register)
route.post('/contact/register', loginRequired, contactController.register)

route.get('/contact/update/:id', loginRequired, contactController.update);
route.post('/contact/update/:id', loginRequired, contactController.update);

route.get('/auth/login', authController.login)
route.post('/auth/login', authController.login)

route.get('/auth/signup', authController.signup)

route.post('/auth/signup', authController.signup)
route.get('/auth/logout', authController.logout)

module.exports = route;