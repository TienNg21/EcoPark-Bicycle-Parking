const express = require('express');
const traxeRouter = express.Router();
const { pool } = require('../dbConfig');

traxeRouter.get('/', (req,res, next)=>{
    if(req.user == null || req.user.email == process.env.EMAIL_ADMIN) res.redirect('../login')
    else{
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
    }
})

traxeRouter.post('/xacnhan', (req,res)=>{
    // let success = false
    pool.query("select id_bai_xe from bai_xe where qr_tra_xe = $1", [req.body.qrcode], async (err, result)=>{
        if(err) console.error(err);
        else if(result.rows.length == 0){
            res.send('false')
        }
        else{
            console.log(result.rows);
            await pool.query("update xe set id_bai_xe = $1, trang_thai = 'available', id_user = null where id_user = $2 and trang_thai = 'active'", 
            [result.rows[0].id_bai_xe, req.user.id_user])
            // console.log('update trang thai xe xong');
            let qr_code = makeRandom(40);
            await pool.query("update bai_xe set qr_tra_xe = $1 where id_bai_xe = $2", [qr_code, result.rows[0].id_bai_xe]);
            // console.log('update bai xe xong');
            // tìm cuốc xe hiện tại để trả xe
            pool.query("select id from lich_su_thue_xe where id_user = $1 and ket_thuc is null and bat_dau is not null order by id desc limit 1", [req.user.id_user], (err, results)=>{
                // update bang lich su thue xe, tinh tien... 
                pool.query("update lich_su_thue_xe set ket_thuc = localtime at time zone 'Asia/Ho_Chi_Minh', id_bai_xe_tra = $1 where id = $2", [result.rows[0].id_bai_xe, results.rows[0].id]);
    
                // send text sang hàm onreadystatechange trong file scan_traxe.ejs 
                res.send('true')
    
            })

        }
    })
})


function makeRandom(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
}

module.exports = traxeRouter;



