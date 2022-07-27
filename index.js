// .env
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

// Requiring =======================================================
// Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');

// Authored
const ExpressError = require('./utilities/ExpressError');
const User = require('./models/user')

// Requiring routes
const shelterRoute = require('./routes/shelters');
const animalRoute = require('./routes/animals');
const userRoute = require('./routes/users');


// Mongoose DB connection ==========================================
mongoose.connect('mongodb://localhost:27017/animalShelter');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Express app setting
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Session =========================================================
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));


// Flash ===========================================================
app.use(flash());

// Authentication ==================================================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware ================================================
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Routes ==========================================================
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use(shelterRoute);
app.use(animalRoute);
app.use(userRoute);


// Error handler ===================================================
// 404 error
app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found! Please try valid URL!", 404));
});

// generic error handle
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, something went wrong!";
    res.status(statusCode).render('error', { err });
});


// Port ============================================================
app.listen(3000, () => {
    console.log("Serving on port 3000");
});