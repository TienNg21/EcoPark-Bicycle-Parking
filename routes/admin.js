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
        const lsu = await pool.query('select id, ngay_thue, bat_dau, ket_thuc, id_user, id_xe, id_bai_xe_thue, id_bai_xe_tra, thanh_tien from lich_su_thue_xe lstx where ket_thuc is not null order by lstx.ngay_thue asc ');
        const price = await pool.query('SELECT * FROM gia_thue_xe');
        const souser = await pool.query('SELECT COUNT(id_user) as tong FROM khach_hang');
        const dthutheongay = await pool.query('select lstx.ngay_thue as ngay_thue, sum(lstx.thanh_tien) as doanh_thu from lich_su_thue_xe lstx where ket_thuc is not null group by lstx.ngay_thue order by lstx.ngay_thue asc');
        function dthuHandler(dthu, index) { 
            let d = new Date(dthu.ngay_thue);
            return { 
                
                ngay_thue: d.getFullYear() + ((d.getMonth() + 1 >= 10) ? ('-' + (d.getMonth() + 1)) : ('-0' + (d.getMonth() + 1))) + ((d.getDate() >= 10) ? ('-' + d.getDate()) : ('-0' + d.getDate())) ,
                doanh_thu: dthu.doanh_thu 
            }; 
        };
        const doanhthu = dthutheongay.rows.map(dthuHandler); 
        // console.log(doanhthu); 
        res.render('admintest.ejs', {
            xe: xe.rows,
            baixe: baixe.rows,
            khachhang: khachhang.rows,
            lsu: lsu.rows,
            dthutheongay: doanhthu,
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
                    error = "???? x???y ra l???i khi thay ?????i th??ng tin xe";
                }else{
                    message = "?????i th??ng tin xe th??nh c??ng";
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
                    error = "???? x???y ra l???i khi x??a xe"
                }else{
                    message = "X??a xe th??nh c??ng!";
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
                error = "???? x???y ra l???i khi th??m xe";
            }else{
                message = "Th??m xe th??nh c??ng";
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
                    error = "???? x???y ra l???i khi thay ?????i th??ng tin b??i xe";
                }else{
                    message = "Thay ?????i th??ng tin b??i xe th??nh c??ng";
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
                    err = "???? x???y ra l???i khi x??a b??i xe";
                    res.redirect('/admin');
                }
                if (results.rows[0].so_luong_xe == 0) {
                    pool.query(
                        'delete from bai_xe where id_bai_xe=$1',
                        [req.body.id_bai_xe],
                        (err, results) => {
                            if(err){
                                error = "???? x???y ra l???i khi x??a b??i xe";
                            }else{
                                message = "X??a b??i xe th??nh c??ng";
                            }
                            res.redirect('/admin#baixe');
                        }
                    )
                } else{
                    error = "X??a b??i xe kh??ng th??nh c??ng";
                    res.redirect('/admin#baixe');
                }
            }
        )
    }
})

adminRouter.post('/thembaixe', (req, res) => {
    //random ra 2 c??i text ng???u nhi??n (????? d??i l?? 40 gi???ng nh?? hash)
    let qr_thue_random1 = getRandomString(40);
    let qr_tra_random2 = getRandomString(40);
    // console.log(qr_thue_random1, qr_tra_random2);
    // sau ???? th??m n?? v??o csdl ???ng vs .qr_thu?? v?? .qr_tr???
    pool.query(
        `insert into bai_xe (ten_bai, so_luong_xe, pos_x, pos_y, qr_thue_xe, qr_tra_xe)
        values ($1, 0, $2, $3, $4, $5)`,
        [req.body.ten_bai_xe_them, req.body.pos_x, req.body.pos_y, qr_thue_random1, qr_tra_random2],
        (err, results) => {
            if(err){
                error = "???? x???y ra l???i khi th??m b??i xe";
            }else{
                message = "Th??m b??i xe th??nh c??ng"                
            }
            res.redirect('/admin#baixe');
        }
    )
})

adminRouter.post('/price', (req, res) => {
    if(req.body.action == 'one_h'){
        if(req.body.pricechange < 0){
            error = "Gi?? thu?? xe kh??ng h???p l???";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET one_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "???? x???y ra l???i khi thay ?????i gi??";
                }else{
                    message = "Thay ?????i gi?? thu?? xe th??nh c??ng";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'two_h'){
        if(req.body.pricechange < 0){
            error = "Gi?? thu?? xe kh??ng h???p l???";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET two_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "???? x???y ra l???i khi thay ?????i gi??";
                }else{
                    message = "Thay ?????i gi?? thu?? xe th??nh c??ng";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'three_h'){
        if(req.body.pricechange < 0){
            error = "Gi?? thu?? xe kh??ng h???p l???";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET three_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "???? x???y ra l???i khi thay ?????i gi??";
                }else{
                    message = "Thay ?????i gi?? thu?? xe th??nh c??ng";
                }
                res.redirect('/admin#price');
            }
        )
    }else if(req.body.action == 'delay_h'){
        if(req.body.pricechange < 0){
            error = "Gi?? thu?? xe kh??ng h???p l???";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET delay_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "???? x???y ra l???i khi thay ?????i gi??";
                }else{
                    message = "Thay ?????i gi?? thu?? xe th??nh c??ng";
                }
                res.redirect('/admin#price');
            }
        )
    }else{
        if(req.body.pricechange < 0 || req.body.pricechange > 100) {
            error = "T??? l??? gi???m gi?? t??? 0 ?????n 100%";
            res.redirect('/admin#price');
        }
        pool.query(
            `UPDATE gia_thue_xe
            SET disc = $1`,
            [req.body.pricechange],
            (err, result) => {
                if(err){
                    error = "???? x???y ra l???i khi thay ?????i gi??";
                }else{
                    message = "Thay ?????i gi?? thu?? xe th??nh c??ng";
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
});

adminRouter.get('/qrpage/:id', async (req, res)=>{
    // if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
    //     res.redirect('/login');
    // }else{
        const data = await pool.query('SELECT qr_thue_xe, qr_tra_xe, ten_bai FROM bai_xe where id_bai_xe = $1', [req.params.id]);
        // console.log(data.rows);
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