
const { Router } = require('express');
const express = require('express');
const rentRouter = express.Router();
const { pool } = require('../dbConfig');

rentRouter.get("/", async (req, res)=>{
    if(req.user == null) res.redirect('../login')
    console.log("view rent page");
    var idbai = req.query.idbai;
    // console.log(idbai);
    pool.query("select bx.id_bai_xe, bx.ten_bai, count(x.id_xe) as so_luong from bai_xe bx left join xe x on (bx.id_bai_xe = x.id_bai_xe) where x.trang_thai not in ('pending', 'active') group by bx.id_bai_xe", (err, result)=>{
        console.log(result.rows);
        pool.query("select one_h, two_h, three_h, disc from gia_thue_xe", (errs,results)=>{
            console.log(results.rows)
            pool.query("select * from xe where id_user = $1 and trang_thai = 'pending'", [req.user.id_user], (err, xe_pending)=>{
                if(xe_pending.rows.length == 0){
                    res.render("rent.ejs", {gia: results.rows, baixe: result.rows, bai: (idbai ? idbai : ''), pending: false, id_bai_pending: null, id_xe_pending: null, message: req.flash('message')});
                }
                
                else if(xe_pending.rows.length > 0){
                    console.log(xe_pending.rows);
                    res.render("rent.ejs", {gia: results.rows, baixe: result.rows, bai: (idbai ? idbai : ''), pending: true, id_bai_pending: xe_pending.rows[0]['id_bai_xe'], id_xe_pending: xe_pending.rows[0]['id_xe'], message: req.flash('message')});

                }
            })
        })
    })
})

rentRouter.get("/:id_bai", (req, res, next)=>{
    if(req.user == null) res.redirect('../login')
    var string = encodeURIComponent(req.params.id_bai);
    res.redirect('/rent?idbai=' + string);
})

rentRouter.post('/chonbai', (req, res)=>{
    // console.log(req.body.idbai);
    // res.send('nhan dc roi')
    pool.query("select id_xe, trang_thai, loai_xe from xe where id_bai_xe = $1 and trang_thai not in ('active', 'pending')", [req.body.idbai], (err, result)=>{
        if(err) console.error(err);
        else{
            // console.log(result.rows);
            res.send(result.rows)
        }
    })
})

rentRouter.post("/scan", async (req, res)=>{
    console.log(req.body);
    // console.log(req.user);
    pool.query("select * from xe where id_user = $1 and (trang_thai = 'active' or trang_thai = 'pending')", [req.user.id_user], (err, result)=>{
        if(result.rows.length > 0){
            // user đã thuê xe hoặc đã chọn xe rồi nhưng chưa quét, không cho thuê nữa
            if(result.rows[0]['trang_thai'] == 'pending'){
                // thông báo yêu cầu đợi hết pending hoặc thuê luôn xe đó
                console.log('có xe đang pending');
                res.redirect('/rent')

            }
            if(result.rows[0]['trang_thai'] == 'active'){
                // thông báo yêu cầu trả xe để thuê xe mới
                console.log('user đã có xe đang thuê');
                req.flash('message', 'Bạn đã có xe đang thuê, vui lòng trả xe trước khi thuê xe mới!')
                res.redirect('/')

            }
        }
        else{
            pool.query("select trang_thai from xe where id_xe = $1", [req.body.xe], (err, result)=>{
                if(result.rows.length > 0){
                    if(result.rows[0]['trang_thai'] == 'pending' || result.rows[0]['trang_thai'] == 'active'){
                        req.flash('message', 'Xe đã được người dùng khác chọn, bạn vui lòng chọn xe khác')
                        res.redirect('/rent')
                    }
                    else{
                        pool.query(`update public.xe set trang_thai = 'pending', id_user = ${req.user.id_user} where id_xe = ${req.body.xe};`, async (err, result)=>{
                            if(err) {
                                console.error(err)
                                res.send('loi roi')
                            }
                            else {
                                pool.query(`select ten_bai from bai_xe where id_bai_xe = ${req.body.bai}`, async (err, data)=>{
                                    console.log(data.rows);
                                    res.render('scan.ejs', {ten_bai: data.rows[0]['ten_bai'], id_bai: req.body.bai});
                                    console.log('bat dau doi 5 phut');
                                    // doi 5 phut
                                    await timeout(300000)
                                    console.log('het 5 phut')
                                    // kiem tra trang thai hien tai cua xe
                                    pool.query("select trang_thai, id_user from public.xe where id_xe = $1", [req.body.xe], (err, result)=>{
                                        if(err) console.error(err)
                                        else{
                                            if(result.rows.length == 0){console.error('Khong tim thay xe')}
                                        else{
                                            // console.log(result.rows[0]['trang_thai'])
                                            // neu trang thai van la pending thi chuyen thanh available
                                            if(result.rows[0]['trang_thai'] == `pending`) {
                                                pool.query(`update public.xe set trang_thai = 'available', id_user = null where id_xe = ${req.body.xe}`);
                                            }
                                            //
                                            if(result.rows[0]['trang_thai'] == 'active' && result.rows[0]['id_user'] == req.user.id_user){
                                                console.log('xe da duoc thue');
                                            }
                                            // neu trang thai khac pending tuc la nguoi dung da quet ma thanh cong, xe dang duoc su dung
                                        }
                                    }
                                })
                                
                            })
                            }
                        })
                    }
                }
            })
            
        }
    })
    
})

rentRouter.get('/scan/:idbai/:tenbai', (req, res)=>{
    if(req.user == null) res.redirect('../login')
    // res.send('get scan')
    // var idbai = req.query.idbai;
    pool.query("select * from xe where trang_thai = 'pending' and id_user = $1 and id_bai_xe = $2", [req.user.id_user, req.params.idbai], (err, result)=>{
        if(result.rows.length == 0) {
            req.flash('message', 'Hết thời gian chờ, mời bạn chọn lại xe!')
            res.redirect('/rent')}
        else{
            res.render('scan.ejs', {id_bai: req.params.idbai, ten_bai: req.params.tenbai});

        }
    })

})

rentRouter.get('/cancel/:id_xe', (req, res)=>{
    if(req.user == null) res.redirect('../login')
    pool.query("select * from xe where id_xe = $1 and id_user = $2 and trang_thai = 'pending'", [req.params.id_xe, req.user.id_user], (err, result)=>{
        if(err) console.error(err);
        else{
            if(result.rows.length == 0) {
                req.flash('message', 'Hết thời gian chờ, mời bạn chọn lại xe!')
                res.redirect('/rent')
            }
            else{
                pool.query("update xe set id_user = null, trang_thai = 'available' where id_xe = $1", [req.params.id_xe])    
                req.flash('message', 'Huỷ xe thành công, mời bạn chọn lại xe!')
                res.redirect('/rent')
            }

        }
    })
})

rentRouter.post('/xacnhan', (req, res)=>{
    console.log(req.body);
    console.log(req.user.id_user);
    // so sanh ma qr, thong bao khi sai, dung
    pool.query("select id_xe from xe where id_user = $1 and trang_thai = 'pending'", [req.user.id_user], (err, result) => {
        // err thi thong bao xe khong con trong trang thai pending
        if(err) console.error(err);
        else {
            if(result.rows.length == 0) { 
                console.error('Het thoi gian pending');
                res.send('het_pending');
            }
            else {
                let id_xe = result.rows[0].id_xe;
                pool.query("select * from bai_xe where id_bai_xe = $1 and qr_thue_xe = $2", [req.body.idbai, req.body.qrcode], (err, result) => {
                    if(err) console.error(err)
                    else {
                        if (result.rows.length == 0) {
                            console.log("quet sai ma roi");
                            // thong bao quet sai va cho quet lai
                            res.send('quet_sai');
                        }
                        else {
                            // cap nhat csdl khi quet dung
                            console.log("thue xe thanh cong");
                            // set trang thai xe
                            pool.query("update xe set trang_thai = 'active' where id_user = $1 and id_bai_xe = $2 and trang_thai = 'pending'", [req.user.id_user, req.body.idbai]);
                            // console.log("set trang thai xe thanh cong");
                            // doi qr_thue_xe
                            let random = makeRandom(40);
                            pool.query("update bai_xe set qr_thue_xe = $1 where id_bai_xe = $2", [random, req.body.idbai]);
                            // console.log("set lai qr_thue thanh cong")
                            // cap nhat bang lichsuthuexe
                            pool.query("insert into lich_su_thue_xe (ngay_thue, bat_dau, id_user, id_xe) values (current_date at time zone 'Asia/Ho_Chi_Minh', localtime at time zone 'Asia/Ho_Chi_Minh', $1, $2)", [req.user.id_user, id_xe]);
                            // thong bao thue xe thanh cong
                            // chuyen ve dashboard '/'
                            res.send('thue_xe_thanh_cong');
                        }
                    }
                });
            }
        }
    })
})

// tra xe tinh tien

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
  

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
module.exports = rentRouter;