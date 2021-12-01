const express = require('express');
const adminRouter = express.Router();
const { pool } = require('../dbConfig');

let xe = [];
let baixe = [];
let khachhang = [];
let lsu = [];
let price = {
    one: 50000,
    two: 70000,
    three: 10000,
    late30: 30000
}

adminRouter.get('/', (req,res) => {
    if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
        res.redirect('/login');
    }else{
        pool.query(
            'SELECT xe.id_xe, xe.id_user, bai_xe.ten_bai, xe.loai_xe, xe.trang_thai FROM xe, bai_xe WHERE xe.id_bai_xe = bai_xe.id_bai_xe',
            (err, results) => {
                xe = results.rows;
            }
        );
        pool.query(
            'SELECT * FROM bai_xe;',
            (err, results) => {
                baixe = results.rows;
            }
        );
        pool.query(
            'SELECT * FROM khach_hang WHERE email != $1', [process.env.EMAIL_ADMIN],
            (err, results) => {
                khachhang = results.rows;
            }
        )
        pool.query(
            'SELECT * FROM lich_su_thue_xe',
            (err, results) => {
                lsu = results.rows;
            }
        )
        res.render('admintest.ejs', {
            xe: xe,
            baixe: baixe,
            khachhang: khachhang,
            lsu: lsu,
            price: price
        });
        
    }
    
})

adminRouter.post('/baixe', (req,res) => {

})

adminRouter.post('/price', (req, res) => {
    console.log(req.body);
    if(req.body.action == "one"){
        price.one = req.body.one;
    }else if(req.body.action == "two"){
        price.two = req.body.two;
    }else if(req.body.action == "three"){
        price.three = req.body.three;
    }else{
        price.late30 = req.body.late30;
    }
    res.redirect('/admin');
})



adminRouter.get('/logout', (req,res) =>{
    res.redirect('/logout');
})
module.exports = adminRouter;