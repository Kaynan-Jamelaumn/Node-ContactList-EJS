require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.DBCONNECTIONSTRING).
  then(() => {
    console.log('db conectado');
    app.emit('pronto');
  })
  .catch(() => console.log('falha ao conectar ao db'));

const session = require('express-session');
const connectMongo = require('connect-mongo');
const flash = require('connect-flash');

const helmet = require('helmet');
const csrf = require('csurf');
const path = require('path');
const routes = require('./routes');
const { middleWareGlobal, checkCSRFError, CSRFMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));// permitir envio de formulário
app.use(express.json());
app.use(express.static('./public')); //css img

const sessionOptions = session({
  secret: process.env.SESSIONSECRET,
  store: connectMongo.create({ mongoUrl: process.env.DBCONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 31,
    httpOnly: true
  }
})

app.use(sessionOptions);
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views')); // views são templates html
app.set('view engine', 'ejs'); // pra renderizar o html com tags e coisa assim

app.use(csrf());
app.use(middleWareGlobal);
app.use(checkCSRFError);
app.use(CSRFMiddleware);
app.use(routes);
app.on('pronto', () => { app.listen(8765, () => console.log("server is running at: http://localhost:8765")) });