const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const { dirname } = require('path');
const { fileURLToPath } = require('url');


const app = express();
app.use(express.urlencoded({
  extended: true
}));

app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'models')));

app.get('/', function (req, res) {
  res.render('home', { title: 'Home Page' });
});

app.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
});

app.listen(3030, function serverStartedHandler() {
  console.log('Web server is running at http://localhost:3030');
});
