const express = require('express');
const inforRouter = express.Router();
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");

const blankerrors = []
const blanksuccess = []

let errors = [];
let success = []

inforRouter.get('/', (req, res) => {
    if(req.user == null){
        res.redirect('../login');
    }
    console.log("view infor page");
    
    let userInfor = req.user;
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
        errors: blankerrors,
        success: blanksuccess
    });
})

inforRouter.post('/', async (req, res) => {
    var newUser = req.body;
    var phone = newUser.sdt;
    errors = [];
    success = []
    var CMND = newUser.cmnd;
    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(phone.length != 10 || phone_regex.test(phone) == false){
        errors.push({message: "Số điện thoại không hợp lệ"});
    }

    var cmnd_regex =   /^[0-9_-]{9,12}$/;
    if((CMND.length != 9 && CMND.length != 12) || cmnd_regex.test(CMND) == false){
        errors.push({message: "Số CMND/CCCD phải gồm 9 hoặc 12 số"});
    }
    if(errors.length > 0){
        // console.log(errors);
        // let userInfor = req.user;
                res.render('infor.ejs', {
                    ten: req.user.ten,
                    email: req.user.email,
                    diachi: req.user.dia_chi,
                    sdt: req.user.sdt,
                    cmnd: req.user.cmnd,
                    gioitinh: req.user.gioi_tinh,
                    lacudan: req.user.la_cu_dan,
                    macudan: req.user.ma_cu_dan,
                    errors: errors,
                    success: success
                });
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
                success.push({message: 'Cap nhat thong tin thanh cong'})
                // res.redirect("/infor");
                // let userInfor = req.user;
                res.render('infor.ejs', {
                    ten: req.user.ten,
                    email: req.user.email,
                    diachi: req.user.dia_chi,
                    sdt: req.user.sdt,
                    cmnd: req.user.cmnd,
                    gioitinh: req.user.gioi_tinh,
                    lacudan: req.user.la_cu_dan,
                    macudan: req.user.ma_cu_dan,
                    errors: errors,
                    success: success
                });
                
            }
        )
})

inforRouter.post('/password', async (req, res)=>{
    // res.send(req.body)
    errors = []
    let {password, password1, password2} = req.body
    if(password1 !== password2){
        errors.push({message: 'Mat khau xac nhan khong khop'})
    }
    if(password.length < 6 || password1.length < 6 || password2.length < 6){
        errors.push({message: "Mật khẩu cần có ít nhất 6 ký tự."});
    }
    if(errors.length > 0){
        // let userInfor = req.user;
                res.render('infor.ejs', {
                    ten: req.user.ten,
                    email: req.user.email,
                    diachi: req.user.dia_chi,
                    sdt: req.user.sdt,
                    cmnd: req.user.cmnd,
                    gioitinh: req.user.gioi_tinh,
                    lacudan: req.user.la_cu_dan,
                    macudan: req.user.ma_cu_dan,
                    errors: errors,
                    success: success
                });
    }
    else{
        let curPass = req.user.password
        let check = bcrypt.compareSync(password, curPass);
        if(!check){
            errors.push({message: 'Mat khau cu chua chinh xac'})
            // let userInfor = req.user;
            res.render('infor.ejs', {
                ten: req.user.ten,
                email: req.user.email,
                diachi: req.user.dia_chi,
                sdt: req.user.sdt,
                cmnd: req.user.cmnd,
                gioitinh: req.user.gioi_tinh,
                lacudan: req.user.la_cu_dan,
                macudan:req.user.ma_cu_dan,
                errors: errors,
                success: success
            });
        }
        else{
            let hashedPassword = await bcrypt.hash(password1, 10);
            pool.query(
                'update khach_hang set password = $1 where email = $2' ,
                [hashedPassword, req.user.email],
                (err, results)=>{
                    if(err) throw err
                    success.push({message: 'Doi mat khau'})
                    // res.redirect('/infor')
                    // let userInfor = req.user;
                    res.render('infor.ejs', {
                        ten: req.user.ten,
                        email: req.user.email,
                        diachi: req.user.dia_chi,
                        sdt: req.user.sdt,
                        cmnd: req.user.cmnd,
                        gioitinh: req.user.gioi_tinh,
                        lacudan: req.user.la_cu_dan,
                        macudan:req.user.ma_cu_dan,
                        errors: errors,
                        success: success
                    });
                }
            )
        }
    }

})

module.exports = inforRouter;