const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
var app = express();
// Configure mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// Configure Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Configure express-session middleware
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}));
var auth = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Root endpoint, redirect to login, if not logged in, or content if logged in
app.get('/', function (req, res) {
  if (req.session && req.session.admin) {
    res.redirect('/content');
  } else {
    res.redirect('/login');
  }
});

// Login endpoint
app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function (req, res) {
  let correctAnswer = "james";
  if (req.body.name && req.body.password === correctAnswer) {
    req.session.user = "james";
    req.session.admin = true;
    res.redirect('/content');
  }
});

// // Get content endpoint
app.get('/content', auth, function (req, res) {
    res.render('content');
});

// Logout endpoint
app.post('/logout', function (req, res) {
  req.session.destroy();
  res.render('logout');
});

app.listen(3000, function() {
  console.log('Catch-a-Murray started on port 3000...');
});
