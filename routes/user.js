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

userRouter.get("/", async (req, res) => {
    if(req.user == null){
        // console.log("view dashboard page, but not logged in => login page");

        res.redirect("/login");
    }else { 
        // console.log(req.user.email);
        if (req.user.email == process.env.EMAIL_ADMIN) {
            // console.log("view admin page");
            res.redirect("/admin");
        } else {
            // console.log("view dashboard page");
            const bat_dau = await pool.query(
                `SELECT ngay_thue, bat_dau FROM lich_su_thue_xe WHERE id_user = ${req.user.id_user} AND ket_thuc IS NULL`
            );
            if(bat_dau.rows.length != 0){
                let d = new Date(bat_dau.rows[0].ngay_thue);
                bat_dau.rows[0].ngay_thue = d.getFullYear() + ((d.getMonth() + 1 >= 10) ? ('-' + (d.getMonth() + 1)) : ('-0' + (d.getMonth() + 1))) + ((d.getDate() >= 10) ? ('-' + d.getDate()) : ('-0' + d.getDate()));
            }
            res.render("dashboard.ejs", {
                message: req.flash('message'),
                time_rent: bat_dau.rows
            });
        }
    }
})


//register
userRouter.get("/register", (req, res) => {
    // console.log("view register page");

    res.render("register.ejs", {user: user});
})

userRouter.post("/register", async (req, res) => {
    let { name, email, addr, phone, lacudan, macudan, CMND, gender, password, password2} = req.body;
    // user = req.body

    // console.log(req.body);

    let errors = [];

    var phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(phone.length != 10 || phone_regex.test(phone) == false){
        // user.phone = ''
        req.body.phone = ''
        errors.push({message: "S??? ??i???n tho???i kh??ng h???p l???."});
    }

    var cmnd_regex =   /^[0-9_-]{9,12}$/;
    if((CMND.length != 9 && CMND.length != 12) || cmnd_regex.test(CMND) == false){
        // user.CMND = ''
        req.body.CMND = ''
        errors.push({message: "S??? CMND/CCCD ph???i g???m 9 ho???c 12 s???."});
    }
    if(password.length < 6){
        errors.push({message: "M???t kh???u c???n c?? ??t nh???t 6 k?? t???."});
    }

    if(password !== password2){
        errors.push({message: "M???t kh???u x??c nh???n kh??ng kh???p."});
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
                    errors.push({message: "Email n??y ???? ????ng k?? v???i t??i kho???n kh??c."});
                }
                
                    pool.query(
                        'SELECT * FROM khach_hang WHERE cmnd = $1', [CMND], (err, results)=>{
                            if(results.rows.length > 0){
                                // user.CMND = ''
                                req.body.CMND = ''
                                errors.push({message: "S??? CMND/CCCD ???? ???????c ????ng k?? v???i t??i kho???n kh??c."})
                            }

                                if(lacudan == 'true'){
                                    pool.query(
                                        'SELECT * FROM khach_hang WHERE ma_cu_dan = $1', [macudan], (err, resultss)=>{
                                            if(resultss.rows.length > 0){
                                                errors.push({message: "M?? c?? d??n ???? ???????c ????ng k?? v???i t??i kho???n kh??c."})

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
                                                            
                                                            req.flash('success_msg', "????ng k?? th??nh c??ng. Vui l??ng ????ng nh???p.");
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
                                                
                    
                                                req.flash('success_msg', "????ng k?? th??nh c??ng. Vui l??ng ????ng nh???p.");
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
    // console.log("log out");

    req.logOut();
    req.flash('success_msg', "B???n v???a ????ng xu???t.");
    res.redirect('/login');
});

userRouter.get("/login", (req, res) => {
    // console.log("view login page");

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