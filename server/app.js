const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    },
  })
);

// Route for the index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route for the home page
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/pages/home.html');
});

// Route for the profile page
app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/pages/profile.html');
});

// Route for the contact us page
app.get('/contact-us', (req, res) => {
  res.render('template', { content: 'contact-us.ejs' });
});

// Route for the about us page
app.get('/about-us', (req, res) => {
  res.render('template', { content: 'about-us.ejs' });
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
