const express = require('express');
const userRouter = express.Router();
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");
const passport = require('passport');
const initializePassport = require("../passportConfig");

initializePassport(passport);

const user = {
    name: '',
    email: '',
    addr: '', 
    phone: '', 
    lacudan: '', 
    macudan: '', 
    CMND: '', 
    gender: '', 
    password: '', 
    password2: ''
}

userRouter.get("/", (req, res) => {
    if(req.user == null){
        console.log("view dashboard page, but not logged in => login page");

        res.redirect("/login");
    }else{
        console.log("view dashboard page");
        
        res.render("dashboard.ejs");
    }
})


//register
userRouter.get("/register", (req, res) => {
    console.log("view register page");

    res.render("register.ejs", {user: user});
})

userRouter.post("/register", async (req, res) => {
    let { name, email, addr, phone, lacudan, macudan, CMND, gender, password, password2} = req.body;
    // user = req.body

    console.log(req.body);

    let errors = [];

    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(phone.length != 10 || phone_regex.test(phone) == false){
        // user.phone = ''
        req.body.phone = ''
        errors.push({message: "Số điện thoại không hợp lệ."});
    }

    var cmnd_regex =   /^[0-9_-]{9,12}$/;
    if((CMND.length != 9 && CMND.length != 12) || cmnd_regex.test(CMND) == false){
        // user.CMND = ''
        req.body.CMND = ''
        errors.push({message: "Số CMND/CCCD phải gồm 9 hoặc 12 số."});
    }
    if(password.length < 6){
        errors.push({message: "Mật khẩu cần có ít nhất 6 ký tự."});
    }

    if(password !== password2){
        errors.push({message: "Mật khẩu xác nhận không khớp."});
    }

    if(errors.length > 0){
        res.render("register", {errors: errors, user: req.body});
    }else{
        // form validation has pass

        let hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        pool.query(
            "SELECT * FROM khach_hang WHERE email = $1", [email], (err, results) => {
               
                // console.log(results.rows.length);

                if(results.rows.length > 0){
                    // user.email = ''
                    req.body.email = ''
                    errors.push({message: "Email này đã đăng ký với tài khoản khác."});
                }
                
                    pool.query(
                        'SELECT * FROM khach_hang WHERE cmnd = $1', [CMND], (err, results)=>{
                            if(results.rows.length > 0){
                                // user.CMND = ''
                                req.body.CMND = ''
                                errors.push({message: "Số CMND/CCCD đã được đăng ký với tài khoản khác."})
                            }

                                if(lacudan == 'true'){
                                    pool.query(
                                        'SELECT * FROM khach_hang WHERE ma_cu_dan = $1', [macudan], (err, resultss)=>{
                                            if(resultss.rows.length > 0){
                                                errors.push({message: "Mã cư dân đã được đăng ký với tài khoản khác."})

                                            }
                                        
                                                if(errors.length > 0) res.render('register', {errors: errors, user: req.body})
                                                else
                                                    pool.query(
                                                        `INSERT INTO khach_hang (ten, email, dia_chi, sdt, la_cu_dan, ma_cu_dan, CMND, gioi_tinh, password)
                                                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                                                        [name, email, addr, phone, lacudan, macudan, CMND, gender, hashedPassword],
                                                        (err, results) => {
                                                            if(err){
                                                                throw err;
                                                            }
                                                            
                                                            req.flash('success_msg', "Đăng ký thành công. Vui lòng đăng nhập.");
                                                            res.redirect('login');
                                                        }
                                                    )
                                          
                                        }
                                    )
                                }
                                else{
                                    if(errors.length > 0) res.render('register', {errors: errors, user: req.body})
                                    else
                                        pool.query(
                                            `INSERT INTO khach_hang (ten, email, dia_chi, sdt, la_cu_dan, ma_cu_dan, CMND, gioi_tinh, password)
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                                            [name, email, addr, phone, lacudan, macudan, CMND, gender, hashedPassword],
                                            (err, results) => {
                                                if(err){
                                                    throw err;
                                                }
                                                
                    
                                                req.flash('success_msg', "Đăng ký thành công. Vui lòng đăng nhập.");
                                                res.redirect('login');
                                            }
                                        )
                                }
                            
                        }
                    )
            }
        )
    }
});

userRouter.get("/logout", (req, res) => {
    console.log("log out");

    req.logOut();
    req.flash('success_msg', "Bạn vừa đăng xuất.");
    res.redirect('/login');
});

userRouter.get("/login", (req, res) => {
    console.log("view login page");

    res.render("login.ejs");
})

userRouter.post("/login", 
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })
);

module.exports = userRouter;