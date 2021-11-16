const express = require('express');
const inforRouter = express.Router();
const { pool } = require("../dbConfig");

let errors = [];

inforRouter.get('/', (req, res) => {
    if(req.user == null){
        res.redirect('../login');
    }
    console.log("view infor page");
    
    var userInfor = req.user;
    // console.log(userInfor);
    res.render('infor.ejs', {
        ten: userInfor.ten,
        email: userInfor.email,
        diachi: userInfor.dia_chi,
        sdt: userInfor.sdt,
        cmnd: userInfor.cmnd,
        gioitinh: userInfor.gioi_tinh,
        lacudan: userInfor.la_cu_dan,
        macudan: userInfor.ma_cu_dan,
        errors: errors
    });
})

inforRouter.post('/', async (req, res) => {
    var newUser = req.body;
    var phone = newUser.sdt;
    errors = [];
    var CMND = newUser.cmnd;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(phone.length != 10 || phone_regex.test(phone) == false){
        errors.push({message: "Số điện thoại không hợp lệ"});
    }

    var cmnd_regex =   /^[0-9_-]{9,12}$/;
    if((CMND.length != 9 && CMND != 12) || cmnd_regex.test(CMND) == false){
        errors.push({message: "Số CMND/CCCD phải gồm 9 hoặc 12 số"});
    }
    if(errors.length > 0){
        // console.log(errors);
        res.redirect("/infor");
    }else
        pool.query(
            `UPDATE khach_hang
            SET ten = $1, dia_chi = $2, sdt = $3, ma_cu_dan = $4, cmnd = $5, gioi_tinh = $6
            WHERE email = $7`,
            [newUser.ten, newUser.dia_chi, newUser.sdt, newUser.ma_cu_dan, newUser.cmnd, newUser.gioi_tinh, newUser.email],
            (err, results) => {
                if(err){
                    throw err;
                }
                res.redirect("/infor");
                
            }
        )
})


module.exports = inforRouter;