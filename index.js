const express       =   require('express');
const app           =   express();
const port          =   process.env.PORT || 8012;

const mongoose      =   require('mongoose');
const passport      =   require('passport');
const flash         =   require('connect-flash');

const morgan        =   require('morgan');
const cookieParser  =   require('cookie-parser');
const bodyParser    =   require('body-parser');
const session       =   require('express-session');

// MongoDB connect
const dbConfig      =   require('./config/db.js');
mongoose.connect(dbConfig.url);

// Express middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

// Passport middlewares
require('./config/passport')(passport);
app.use(session({ secret : 'hiimsecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require('./routes/routes.js')(app, passport);

app.listen(port, () => console.log('Server running on port ' + port));