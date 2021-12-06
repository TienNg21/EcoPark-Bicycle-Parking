const express = require('express');
const adminRouter = express.Router();
const { pool } = require('../dbConfig');
var xe;
var baixe;
var khachhang;
var lsu;
var price;

adminRouter.get('/', async (req,res) => {
    if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
        res.redirect('/login');
    }else{        
        pool.query(
            'SELECT xe.id_xe, xe.id_user, bai_xe.ten_bai, bai_xe.id_bai_xe, xe.loai_xe, xe.trang_thai FROM xe, bai_xe WHERE xe.id_bai_xe = bai_xe.id_bai_xe',
            (err, results) => {
                xe = results.rows;
                pool.query(
                    'SELECT * FROM bai_xe;',
                    (err, results) => {
                        baixe = results.rows;
                        pool.query(
                            'SELECT * FROM khach_hang WHERE email != $1', [process.env.EMAIL_ADMIN],
                            (err, results) => {
                                khachhang = results.rows;
                                pool.query(
                                    'SELECT * FROM lich_su_thue_xe',
                                    (err, results) => {
                                        lsu = results.rows;
                                        pool.query(
                                            'SELECT * FROM gia_thue_xe',
                                            (err, results) => {
                                                price = results.rows[0];
                                                res.render('admintest.ejs', {
                                                    xe: xe,
                                                    baixe: baixe,
                                                    khachhang: khachhang,
                                                    lsu: lsu,
                                                    price: price
                                                });
                                            }
                                        )
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
    
})

adminRouter.post('/xe', (req, res) => {

})

adminRouter.post('/themxe', (req, res) => {
    // console.log(req.body);
    var xethem = req.body;
    pool.query(
        `INSERT INTO xe (id_bai_xe, id_user, loai_xe, trang_thai)
        VALUES ($1, $2, $3, $4)`,
        [xethem.id_bai_xe_them, null, xethem.loai_xe_them, 'avaiable'],
        (err, results) => {
            console.log("da them");
        }
    )
    res.redirect('/admin');
})

adminRouter.post('/baixe', (req,res) => {
    // console.log(req.body);
    if(req.body.action == 'update') {
        pool.query(
            'update bai_xe set ten_bai = $1 where id_bai_xe =$2',
            [req.body.ten_bai_xe, req.body.id_bai_xe],
            (err, results) => {
                res.redirect('/admin');
            }
        )
    } else {
        pool.query(
            'select so_luong_xe from bai_xe where id_bai_xe=$1',
            [req.body.id_bai_xe],
            (err, results) => {
                if (results.rows[0].so_luong_xe == 0) {
                    pool.query(
                        'delete from bai_xe where id_bai_xe=$1',
                        [req.body.id_bai_xe],
                        (err, results) => {
                            res.redirect('/admin');
                        }
                    )
                } else{
                    //không xoá được
                }
            }
        )
    }
})

adminRouter.post('/thembaixe', (req, res) => {
    //random ra 2 cái text ngẫu nhiên
    let qr_thue_random1 = getRandomString(40);
    let qr_tra_random2 = getRandomString(40);
    console.log(qr_thue_random1, qr_tra_random2);
    // sau đó thêm nó vào csdl ứng vs .qr_thuê và .qr_trả
    pool.query(
        `insert into bai_xe (ten_bai, so_luong_xe, pos_x, pos_y, qr_thue_xe, qr_tra_xe)
        values ($1, 0, $2, $3, $4, $5)`,
        [req.body.ten_bai_xe_them, req.body.pos_x, req.body.pos_y, qr_thue_random1, qr_tra_random2],
        (err, results) => {
            res.redirect('/admin');
        }
    )
})

adminRouter.post('/price', (req, res) => {
    if(req.body.action == 'one_h'){
        pool.query(
            `UPDATE gia_thue_xe
            SET one_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                res.redirect('/admin');
            }
        )
    }else if(req.body.action == 'two_h'){
        pool.query(
            `UPDATE gia_thue_xe
            SET two_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                res.redirect('/admin');
            }
        )
    }else if(req.body.action == 'three_h'){
        pool.query(
            `UPDATE gia_thue_xe
            SET three_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                res.redirect('/admin');
            }
        )
    }else{
        pool.query(
            `UPDATE gia_thue_xe
            SET delay_h = $1`,
            [req.body.pricechange],
            (err, result) => {
                res.redirect('/admin');
            }
        )
    }    
})

adminRouter.get('/qrpage/:id', async (req, res)=>{
    if (req.user == null || req.user.email !== process.env.EMAIL_ADMIN){
        res.redirect('/login');
    }else{
        const data = await pool.query('SELECT qr_thue_xe, qr_tra_xe, ten_bai FROM bai_xe where id_bai_xe = $1', [req.params.id]);
        console.log(data.rows);
        return res.render('qrcode.ejs', {dataa: data.rows[0], id_bai: req.params.id});
    }
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