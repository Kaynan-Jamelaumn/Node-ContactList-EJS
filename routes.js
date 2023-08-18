const express = require('express');
const route = express.Router();
const app = express();


const homeController = require('./src/controllers/homeController');
const authController = require('./src/controllers/authController')
route.get('/', homeController.index)
route.get('/auth/login', authController.login)
route.post('/auth/login', authController.login)

route.get('/auth/signup', authController.signup)

route.post('/auth/signup', authController.signup)
route.get('/auth/logout', authController.logout)

module.exports = route;