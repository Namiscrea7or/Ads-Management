const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user'); 
const markerRouter = require('./routes/marker')
const billboardRouter = require('./routes/billboard')
const reportRouter = require('./routes/report')
const editMarkerRouter = require('./routes/markerEdit')
const editBBRouter = require('./routes/billboardEdit')


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

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/marker", markerRouter)
app.use("/api/billboard", billboardRouter);
app.use("/api/report", reportRouter);
app.use("/api/markerEdit", editMarkerRouter);
app.use("/api/billboardEdit", editBBRouter);


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
app.get('/report', function (req, res) {
  res.render('report', { title: 'Report' });
});
app.get('/markers', function (req, res) {
  res.render('markers', { title: 'Danh sách điểm đặt quảng cáo' });
});
app.get('/billboard', function (req, res) {
  res.render('billboard', { title: 'Danh sách bảng quảng cáo' });
});
app.get('/manageMarker', function (req, res) {
  res.render('manageMarker', { title: 'Quản lí điểm quảng cáo' });
});
app.get('/manageBillboard', function (req, res) {
  res.render('manageBillboard', { title: 'Quản lí Bảng quảng cáo' });
});



app.listen(3030, function serverStartedHandler() {
  console.log('Web server is running at http://localhost:3030');
});

