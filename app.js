import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


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
  res.render('home', { title: 'Home Page'}); 
})




app.listen(3030, function serverStartedHandler() {
  console.log('Web server is running at http://localhost:3000');
});