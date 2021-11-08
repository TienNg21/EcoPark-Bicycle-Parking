const express = require('express');
const userRouter = express.Router();
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");
const passport = require('passport');
const initializePassport = require("../passportConfig");

initializePassport(passport);

userRouter.get("/", (req, res) => {
    if(req.user == null){
        res.render("login.ejs");
    }else{
        res.render("dashboard.ejs", {user: req.user.name});
    }
})


//register
userRouter.get("/register", (req, res) => {
    res.render("register.ejs",);
})

userRouter.post("/register", async (req, res) => {
    let { name, email, password, password2} = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];
    
    if(!name || !email || !password || !password2){
        errors.push({message: "Vui lòng điền tất cả các thông tin."});
    }

    if(password.length < 6){
        errors.push({message: "Mật khẩu cần có ít nhất 6 ký tự."});
    }

    if(password !== password2){
        errors.push({message: "Mật khẩu xác nhận không khớp."});
    }

    if(errors.length > 0){
        res.render("register", {errors: errors});
    }else{
        // form validation has pass

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            "SELECT * FROM users WHERE email = $1", [email], (err, results) => {
               
                console.log(results);

                if(results.rows.length > 0){
                    errors.push({message: "Email này đã đăng ký với tài khoản khác."});
                    res.render("register", {errors: errors});
                }else{
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                        [name, email, hashedPassword], (err, results) => {
                            if(err){
                                throw err;
                            }
                            console.log(results.rows);

                            req.flash('success_msg', "Đăng ký thành công. Vui lòng đăng nhập.");
                            res.redirect('login');
                        }
                    )
                }
            }
        );
    }
});

userRouter.get("/logout", (req, res) => {
    req.logOut();
    req.flash('success_msg', "Bạn vừa đăng xuất.");
    res.redirect('/login');
});

userRouter.get("/login", (req, res) => {
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