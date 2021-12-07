const express = require('express');
const traxeRouter = express.Router();
const { pool } = require('../dbConfig');

traxeRouter.get('/', (req,res, next)=>{
    if(req.user == null) res.redirect('../login')
    pool.query("select trang_thai, id_user from xe where id_user = $1 and trang_thai = 'active'", [req.user.id_user], (err, result)=>{
        if(err) console.error(err);
        else
            {if(result.rows.length == 0){
                req.flash('message', 'Bạn cần thuê xe trước để có thể trả xe!')
                res.redirect('/')
            }
            else{
                res.render('scan_traxe.ejs')
            }
         }  
    })
    // res.render('scan_traxe.ejs')
})

traxeRouter.post('/xacnhan', (req,res)=>{
    let success = false
    pool.query("select id_bai_xe, qr_tra_xe from bai_xe", (err, result)=>{
        console.log(result.rows);
        for(var i = 0; i < result.rows.length; i++) {
            var obj = result.rows[i];
            // console.log(obj.qr_tra_xe);
            if(obj.qr_tra_xe == req.body.qrcode){
                console.log(obj.qr_tra_xe);
                pool.query("update xe set id_bai_xe = $1, trang_thai = 'available', id_user = null where id_user = $2 and trang_thai = 'active'", [obj.id_bai_xe, req.user.id_user])
                console.log('tra xe thanh cong tai bai: ' + obj.id_bai_xe);

                // update bang lich su thue xe, tinh tien... 

                success = true
                break
            }
        }
        if(!success) {
            console.log('quet sai ma roi');
            // send text sang hàm onreadystatechange trong file scan_traxe.ejs 
            res.send('false')
        }
        else{
            // send text sang hàm onreadystatechange trong file scan_traxe.ejs
            res.send('true')
            
        }

        // thong bao tra xe thanh coong
        // chuyển sang page thông tin hoá đơn/ lịch sử thuê xe
    })
})

traxeRouter.get('/oke', (req, res)=>{
    res.render('oke.ejs')
})


module.exports = traxeRouter;



