const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require("./passportConfig");
const Pusher = require('pusher');
const {pool} = require('./dbConfig');

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


const pusher = new Pusher({
    appId: process.env.pusher_app_id,
    key: process.env.pusher_key,
    secret: process.env.pusher_secret,
    cluster: process.env.pusher_cluster,
    encrypted: true
  });
  
  let pgClient;
  
  pool.connect((err, client) => {
    if(err) {
      console.log(err);
    }
    pgClient = client;
    client.on('notification', function(msg) {
      pusher.trigger('watch_realtime_bai_xe', 'update-qr', JSON.parse(msg.payload));
    });
    const query = client.query('LISTEN watch_realtime_bai_xe');
  });


const user = require('./routes/user');
const map = require('./routes/map');
const infor = require('./routes/infor');

const admin = require('./routes/admin');


//user
app.use('/', user);
app.use('/map', map);
app.use('/infor', infor); //Thông tin tài khoản
// app.use('/history', history);

//admin
app.use('/admin',admin);

app.listen((process.env.PORT || 3000), (req, res) => {
    console.log("Run in port 3000");
});