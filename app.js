require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const initDatabase = require('./config/db');
const { identifyUser } = require('./middleware/authMiddleware');
const authRouter = require('./routes/authRoutes');
const articleRouter = require('./routes/articleRoutes');

const app = express();
const serverPort = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(identifyUser);

app.use('/', authRouter);
app.use('/', articleRouter);

app.get('/', (req, res) => {
  res.render('home');
});

const bootstrapApp = async () => {
  await initDatabase();

  app.listen(serverPort, () => {
    console.log(`Server is running on http://localhost:${serverPort}`);
  });
};

bootstrapApp();
