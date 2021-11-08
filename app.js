const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require("./passportConfig");

initializePassport(passport);

const app = express();

app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const user = require('./routes/user');
const map = require('./routes/map');

app.use('/', user);
app.use('/', map);

app.listen((process.env.PORT || 3000), (req, res) => {
    console.log("Run in port 3000");
});