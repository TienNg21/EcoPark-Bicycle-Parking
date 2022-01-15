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
      // console.log(msg);
      const events = [
        {
          channel: 'watch_realtime_bai_xe',
          name: 'update-qr',
          data: JSON.parse(msg.payload)
        },
        {
          channel: 'watch_realtime_xe',
          name: 'update_xe',
          data: JSON.parse(msg.payload)
        }
      ]
      pusher.triggerBatch(events);
    });
    client.query('LISTEN watch_realtime_bai_xe');
    client.query('LISTEN watch_realtime_xe');
  });


const user = require('./routes/user');
const map = require('./routes/map');
const infor = require('./routes/infor');
const rent = require('./routes/rent');
const traxe = require('./routes/traxe');
const history = require('./routes/history');

const admin = require('./routes/admin');
const bill = require('./routes/bill');


//user
app.use('/', user);
app.use('/map', map);
app.use('/infor', infor); //Thông tin tài khoản
app.use('/rent', rent);
app.use('/traxe', traxe);
app.use('/bill', bill);
app.use('/history', history);


//admin
app.use('/admin',admin);

app.listen((process.env.PORT || 3000), (req, res) => {
    // console.log("Run in port 3000");
});