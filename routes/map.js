const express = require('express');
const mapRouter = express.Router();
const { pool } = require('../dbConfig');

var baixe;

mapRouter.get("/", (req, res) => { 
    if(req.user == null || req.user.email == process.env.EMAIL_ADMIN){
        res.redirect('../login');
    }
    // console.log("view map page");

    pool.query(
        'SELECT * FROM bai_xe',
        (err, result) => {
            baixe = result.rows;
            res.render("map.ejs", {
                baixe: baixe
            });            
        }
    )

})

mapRouter.get('/:id',(req,res)=>{
    if(req.user == null || req.user.email == process.env.EMAIL_ADMIN){
        res.redirect('../login');
    }
    res.render('lanxe.ejs', {id: req.params.id});
})

module.exports = mapRouter;
