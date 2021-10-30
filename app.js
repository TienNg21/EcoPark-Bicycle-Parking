const express = require('express');


const app = express();

app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: false}));

app.listen((process.env.PORT || 3000), (req, res) => {
    console.log("Run in port 3000");
});

app.get("/", function(req, res) {
    res.render("index.ejs");
})