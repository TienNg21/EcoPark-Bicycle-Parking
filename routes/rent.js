const express = require('express');
const rentRouter = express.Router();

rentRouter.get("/", (req, res) => {
    if(req.user==null) {
        res.redirect('../login');
    }
    console.log("view rent page");

    res.render("rent.ejs");
})

module.exports = rentRouter;