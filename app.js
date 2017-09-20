let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mustacheExpress = require('mustache-express')
let path = require('path')
let expressValidator = require('express-validator')
let expressSession = require('express-session')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let flash = require('connect-flash')
let mongo = require('mongodb')
let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')


mongoose.connect('mongodb://localhost/userDatabase');
let db = mongoose.connection;


app.use(expressSession({secret: 'keyboard cat', saveUninitialized: true, resave: false}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static('public'))

app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(flash());


app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

let mRoutes = require('./routes/mainRoutes')
app.use('/', mRoutes)

app.listen(3000, function(){
  console.log("App running on port 3000")
})