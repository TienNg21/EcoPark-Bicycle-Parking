const express = require('express');
const inforRouter = express.Router();
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");

let errors = [];
var count = 0; // đếm số lần gọi get /infor

inforRouter.get('/', (req, res) => {
    if(req.user == null){
        res.redirect('../login');
    }
    console.log("view infor page");
    count ++;
    if(count != 1){
        errors = [];
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
        macudan: userInfor.ma_cu_dan,
        errors: errors
    });
})

inforRouter.post('/', async (req, res) => {
    var newUser = req.body;
    var phone = newUser.sdt;
    errors = [];
    count = 0;
    var CMND = newUser.cmnd;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(phone.length != 10 || phone_regex.test(phone) == false){
        errors.push({message: "Số điện thoại không hợp lệ"});
    }

    var cmnd_regex =   /^[0-9_-]{9,12}$/;
    if((CMND.length != 9 && CMND.length != 12) || cmnd_regex.test(CMND) == false){
        errors.push({message: "Số CMND/CCCD phải gồm 9 hoặc 12 số"});
    }

    newUser.gioi_tinh = newUser.gioi_tinh.trim();
    if(newUser.gioi_tinh != "Nam" && newUser.gioi_tinh != "Nữ"){
        errors.push({message: "Giới tính phải là Nam hoặc Nữ"});
    }
    if(errors.length > 0){
        // console.log(errors);
        res.redirect("/infor");
    }else
        // errors = []
        pool.query(
            `UPDATE khach_hang
            SET ten = $1, dia_chi = $2, sdt = $3, ma_cu_dan = $4, cmnd = $5, gioi_tinh = $6
            WHERE email = $7`,
            [newUser.ten, newUser.dia_chi, newUser.sdt, newUser.ma_cu_dan, newUser.cmnd, newUser.gioi_tinh, newUser.email],
            (err, results) => {
                if(err){
                    throw err;
                }
                req.flash('success_msg', "Thay đổi thông tin thành công");
                res.redirect("/infor");
            }
        )
})

inforRouter.post('/password', async (req, res)=>{
    // res.send(req.body)
    errors = [];
    count = 0;
    let {password, password1, password2} = req.body
    if(password1 !== password2){
        errors.push({message: 'Mật khẩu xác nhận không khớp.'})
    }
    if(password.length < 6 || password1.length < 6 || password2.length < 6){
        errors.push({message: "Mật khẩu cần có ít nhất 6 ký tự."});
    }
    if(errors.length > 0){
        res.redirect('/infor')
    }
    else{
        let curPass = req.user.password
        let check = bcrypt.compareSync(password, curPass);
        if(!check){
            errors.push({message: 'Mật khẩu cũ không đúng.'});
            res.redirect('/infor');
        }
        else{
            let hashedPassword = await bcrypt.hash(password1, 10);
            pool.query(
                'update khach_hang set password = $1 where email = $2' ,
                [hashedPassword, req.user.email],
                (err, results)=>{
                    if(err) throw err;
                    
                    req.flash('success_msg', "Thay đổi mật khẩu thành công.");
                    res.redirect('/infor');
                }
            )
        }
    }

})

module.exports = inforRouter;