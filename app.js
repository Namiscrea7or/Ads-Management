import express from 'express';
import { engine } from 'express-handlebars';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const absolutePath = path.join(__dirname, 'models', 'data', 'data.json');

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

app.use('/js', express.static(__dirname + '/public/js'));




app.get('/', function (req, res) {
  res.render('home', { title: 'Home Page', absolutePath }); // Pass absolutePath to the view
})




app.listen(3030, function serverStartedHandler() {
  console.log('Web server is running at http://localhost:3000');
});