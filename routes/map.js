const express = require('express');
const mapRouter = express.Router();


mapRouter.get("/map", (req, res) => { 
    res.render("map.ejs");
})

mapRouter.get('/map/:id',(req,res)=>{
    res.render('lanxe.ejs', {id: req.params.id});
})

module.exports = mapRouter;
