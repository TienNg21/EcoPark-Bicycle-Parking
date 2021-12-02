const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require("./passportConfig");

initializePassport(passport);

const app = express();

app.set("view engine", 'ejs');
app.use(express.static(__dirname + '/public'));
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
const infor = require('./routes/infor');
const rent = require('./routes/rent');

const admin = require('./routes/admin');


//user
app.use('/', user);
app.use('/map', map);
app.use('/infor', infor); //Thông tin tài khoản
app.use('/rent', rent);
// app.use('/history', history);


//admin
app.use('/admin',admin);

app.listen((process.env.PORT || 3000), (req, res) => {
    console.log("Run in port 3000");
});