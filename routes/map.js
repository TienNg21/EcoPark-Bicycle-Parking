const express = require('express');
const mapRouter = express.Router();


mapRouter.get("/", (req, res) => { 
    if(req.user == null){
        res.redirect('../login');
    }
    res.render("map.ejs");
})

mapRouter.get('/:id',(req,res)=>{
    if(req.user == null){
        res.redirect('../login');
    }
    res.render('lanxe.ejs', {id: req.params.id});
})

module.exports = mapRouter;
