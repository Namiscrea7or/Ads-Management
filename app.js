const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const authRouter = require('./controller/auth');
const userRouter = require('./controller/user'); 



require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://pphnam:${process.env.DB_PASSWORD}@ads-management.rxoh5xt.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`connected to db successfully`);
  } catch (error) {
    console.log(error);
    console.log(`cannot connect to db`);
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'models')));
app.use(express.static(path.join(__dirname, 'controller')));



app.get('/', function (req, res) {
  res.render('home', { title: 'Home Page' });
});

app.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
});
app.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
});

app.get('/user', (req, res) => {
  res.render('user', { title: 'User Profile' });
});


app.listen(3030, function serverStartedHandler() {
  console.log('Web server is running at http://localhost:3030');
});
