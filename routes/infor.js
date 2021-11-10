const express = require('express');
const inforRouter = express.Router();
const { pool } = require("../dbConfig");

inforRouter.get('/', (req, res) => {
    if(req.user == null){
        res.redirect('../login');
    }
    
    var userInfor = req.user;
    console.log(userInfor);
    res.render('infor.ejs', {
        ten: userInfor.ten,
        email: userInfor.email,
        diachi: userInfor.dia_chi,
        sdt: userInfor.sdt,
        cmnd: userInfor.cmnd,
        gioitinh: userInfor.gioi_tinh,
        lacudan: userInfor.la_cu_dan,
        macudan: userInfor.ma_cu_dan
    });
})

inforRouter.post('/', async (req, res) => {
    
    var newUser = req.body;

    console.log(newUser);
    pool.query(
        `UPDATE khach_hang
        SET ten = $1, dia_chi = $2, sdt = $3, ma_cu_dan = $4, cmnd = $5, gioi_tinh = $6
        WHERE email = $7`,
        [newUser.ten, newUser.dia_chi, newUser.sdt, newUser.ma_cu_dan, newUser.cmnd, newUser.gioi_tinh, newUser.email],
        (err, results) => {
            if(err){
                throw err;
            }
            res.redirect('/');
            
        }
    )
})


module.exports = inforRouter;