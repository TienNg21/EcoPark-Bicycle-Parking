const express = require('express');
const inforRouter = express.Router();
const { pool } = require("../dbConfig");


inforRouter.get('/', (req, res) => {
    if(req.user == null){
        res.redirect('../login');
    }
    var userInfor = req.user;
    
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


module.exports = inforRouter;