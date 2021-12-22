const { text } = require('body-parser');
const express = require('express');
const adminRouter = express.Router();
const { pool } = require('../dbConfig');

var message = "";
var error = "";

adminRouter.get('/', async (req,res) => {
    if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
        res.redirect('/login');
    }else{        

        const xe = await pool.query('SELECT xe.id_xe, xe.id_user, bai_xe.ten_bai, bai_xe.id_bai_xe, xe.loai_xe, xe.trang_thai FROM xe, bai_xe WHERE xe.id_bai_xe = bai_xe.id_bai_xe ORDER BY bai_xe.ten_bai ASC');
        const baixe = await pool.query('SELECT bx.id_bai_xe , bx.ten_bai , bx.pos_x, bx.pos_y , (SELECT COUNT(*) FROM xe WHERE xe.id_bai_xe = bx.id_bai_xe) AS so_luong_xe FROM bai_xe bx ORDER BY bx.ten_bai ASC;');
        const khachhang = await pool.query('SELECT * FROM khach_hang WHERE email != $1 ORDER BY khach_hang.ten ASC', [process.env.EMAIL_ADMIN]);
        const lsu = await pool.query('SELECT * FROM lich_su_thue_xe');
        const price = await pool.query('SELECT * FROM gia_thue_xe');
        const souser = await pool.query('SELECT COUNT(id_user) as tong FROM khach_hang');
        res.render('admintest.ejs', {
            xe: xe.rows,
            baixe: baixe.rows,
            khachhang: khachhang.rows,
            lsu: lsu.rows,
            price: price.rows[0],
            souser: souser.rows[0].tong,
            message: message,
            error: error
        });
        message = "";
        error = "";
    }
    
})

adminRouter.post('/xe', async (req, res) => {
    if(req.body.action == 'update')
    {
        pool.query(
            `UPDATE xe SET id_bai_xe = $1, loai_xe = $2, trang_thai = $3
            WHERE id_xe =$4`,
            [req.body.id_bai_xe, req.body.loai_xe, req.body.trang_thai, req.body.id_xe],
            (err, results) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi thông tin xe";
                }else{
                    message = "Đổi thông tin xe thành công";
                }
                res.redirect('/admin#xe');
            })
    }
    else{
        pool.query(
            'delete from xe where id_xe=$1',
            [req.body.id_xe],
            async (err, results) => {
                if(err){
                    error = "Đã xảy ra lỗi khi xóa xe"
                }else{
                    message = "Xóa xe thành công!";
                }
                res.redirect('/admin#xe');
            }
        )
    }
        
})

adminRouter.post('/themxe', (req, res) => {
    // console.log(req.body);
    var xethem = req.body;
    pool.query(
        `INSERT INTO xe (id_bai_xe, id_user, loai_xe, trang_thai)
        VALUES ($1, $2, $3, $4)`,
        [xethem.id_bai_xe_them, null, xethem.loai_xe_them, 'available'],
        async (err, results) => {
            if(err){
                error = "Đã xảy ra lỗi khi thêm xe";
            }else{
                message = "Thêm xe thành công";
            }
            res.redirect('/admin#xe');
        }
    )
})

adminRouter.post('/baixe', (req,res) => {
    // console.log(req.body);
    if(req.body.action == 'update') {
        pool.query(
            `UPDATE bai_xe SET ten_bai = $1 
            WHERE id_bai_xe =$2`,
            [req.body.ten_bai_xe, req.body.id_bai_xe],
            (err, results) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi thông tin bãi xe";
                }else{
                    message = "Thay đổi thông tin bãi xe thành công";
                }
                res.redirect('/admin#baixe');
            }
        )
    } else {
        pool.query(
            'select so_luong_xe from bai_xe where id_bai_xe=$1',
            [req.body.id_bai_xe],
            (err, results) => {
                if(err){
                    err = "Đã xảy ra lỗi khi xóa bãi xe";
                    res.redirect('/admin');
                }
                if (results.rows[0].so_luong_xe == 0) {
                    pool.query(
                        'delete from bai_xe where id_bai_xe=$1',
                        [req.body.id_bai_xe],
                        (err, results) => {
                            if(err){
                                error = "Đã xảy ra lỗi khi xóa bãi xe";
                            }else{
                                message = "Xóa bãi xe thành công";
                            }
                            res.redirect('/admin#baixe');
                        }
                    )
                } else{
                    error = "Xóa bãi xe không thành công";
                    res.redirect('/admin#baixe');
                }
            }
        )
    }
})

adminRouter.post('/thembaixe', (req, res) => {
    //random ra 2 cái text ngẫu nhiên (độ dài là 40 giống như hash)
    let qr_thue_random1 = getRandomString(40);
    let qr_tra_random2 = getRandomString(40);
    // console.log(qr_thue_random1, qr_tra_random2);
    // sau đó thêm nó vào csdl ứng vs .qr_thuê và .qr_trả
    pool.query(
        `insert into bai_xe (ten_bai, so_luong_xe, pos_x, pos_y, qr_thue_xe, qr_tra_xe)
        values ($1, 0, $2, $3, $4, $5)`,
        [req.body.ten_bai_xe_them, req.body.pos_x, req.body.pos_y, qr_thue_random1, qr_tra_random2],
        (err, results) => {
            if(err){
                error = "Đã xảy ra lỗi khi thêm bãi xe";
            }else{
                message = "Thêm bãi xe thành công"                
            }
            res.redirect('/admin#baixe');
        }
    )
})

adminRouter.post('/price', (req, res) => {
    if(req.body.action == 'one_h'){
        if(req.body.pricechange < 0){
            error = "Giá thuê xe không hợp lệ";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET one_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi giá";
                }else{
                    message = "Thay đổi giá thuê xe thành công";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'two_h'){
        if(req.body.pricechange < 0){
            error = "Giá thuê xe không hợp lệ";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET two_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi giá";
                }else{
                    message = "Thay đổi giá thuê xe thành công";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'three_h'){
        if(req.body.pricechange < 0){
            error = "Giá thuê xe không hợp lệ";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET three_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi giá";
                }else{
                    message = "Thay đổi giá thuê xe thành công";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'delay_h'){
        if(req.body.pricechange < 0){
            error = "Giá thuê xe không hợp lệ";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET delay_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi giá";
                }else{
                    message = "Thay đổi giá thuê xe thành công";
                }
                res.redirect('/admin#price');
            }
        )
    }else{
        if(req.body.pricechange < 0 || req.body.pricechange > 100) {
            error = "Tỉ lệ giảm giá từ 0 đến 100%";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET disc = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "Đã xảy ra lỗi khi thay đổi giá";
                }else{
                    message = "Thay đổi giá thuê xe thành công";
                }
                res.redirect('/admin#price');
            }
        )
    }
})

adminRouter.get('/qrpage', async (req, res) => {
    pool.query(
        'SELECT * FROM bai_xe',
        (err, result) => {
            baixe = result.rows;
            res.render("qrmap.ejs", {
                baixe: baixe
            });            
        }
    )
})

adminRouter.get('/qrpage/:id', async (req, res)=>{
    // if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
    //     res.redirect('/login');
    // }else{
        const data = await pool.query('SELECT qr_thue_xe, qr_tra_xe, ten_bai FROM bai_xe where id_bai_xe = $1', [req.params.id]);
        console.log(data.rows);
        return res.render('qrcode.ejs', {dataa: data.rows[0], id_bai: req.params.id});
    // }
})

adminRouter.get('/logout', (req,res) =>{
    res.redirect('/logout');
})

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

module.exports = adminRouter;