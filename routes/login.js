app.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
  });
  
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.render('dashboard', { title: 'Dashboard', user });
    } else {
      res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }
  });
  
  app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
  });
  
  app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    users.push({ name, email, password });
    res.redirect('/');
  });
  
  app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
  });
  
  app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    res.render('forgot-password', { title: 'Forgot Password', message: 'Password reset email sent.' });
  });