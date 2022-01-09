const express = require('express');
const { pool } = require('../dbConfig');
const billRouter = express.Router();

billRouter.get('/', (req, res)=>{
    res.render('oke')
})

billRouter.get('/', async (req, res)=>{
    if(req.user == null){
        res.redirect('../login');
    }
    else{
    const ngay = await pool.query('select ngay_thue from lich_su_thue_xe where id_user = $1 order by ngay_thue desc limit 1', [req.body.id_user]);
    const tenkh = await pool.query('select ten from khach_hang where id_user = $1', [req.body.id_user]);
    const giaThueDuKien = await pool.query('select gia_thue_du_kien from lich_su_thue_xe where id_user = $1 order by bat_dau desc limit 1', [req.body.id_user]);
    const batdau = await pool.query('select bat_dau from lich_su_thue_xe where id_user = $1 order by bat_dau desc limit 1', [req.body.id_user]);
    const ketthuc = await pool.query('select ket_thuc from lich_su_thue_xe where id_user = $1 order by ket_thuc desc limit 1', [req.body.id_user]);
    let tien, donGia, giamgia = 0, tienphat, time, thoigian = ketthuc.getHours()*60 + ketthuc.getMinutes() -(batdau.getHours()*60+batdau.getMinutes()), muon;
    //Lấy đơn giá thuê theo bảng giá
    pool.query('select * from gia_thue_xe', (err, result) =>{
        if(giaThueDuKien == result.rows[0].one_h){
            donGia = pool.query(`select one_h from gia_thue_xe`);
            time = 60;
        }
        if(giaThueDuKien == result.rows[0].two_h){
            donGia = pool.query(`select two_h from gia_thue_xe`);
            time = 120;
        }
        if(giaThueDuKien==result.rows[0].three_h){
            donGia = pool.query(`select three_h from gia_thue_xe`);
            time = 180;
        }
        //Tính tiền nếu trả đúng hạn
        if(thoigian<=time){
            muon = 0;
            tien= donGia*thoigian/60;
        }
        //Tính tiền nếu trả muộn
        tienphat = pool.query(`select delay_h from gia_thue_xe`);
        if(thoigian>time ){
            muon = thoigian - time;
            tien = donGia*thoigian/60 + (muon/30)*tienphat;
        }
    })
    if(req.user.la_cu_dan){
        giamgia = pool.query('select disc from gia_thue_xe' );
        tien = tien*(100 - giamgia)/100;
    }
    pool.query("update lich_su_thue_xe set thanh_tien = $1 where id = $2", [tien, results.rows[0].id])
    res.render('oke.ejs', {
        ngay: ngay,
        tenkh: tenkh,
        thoigiandukien: time,
        batdau: batdau,
        ketthuc: ketthuc,   
        muon: muon, 
        tienphat: tienphat,
        giamgia: giamgia,    
        tienPhaiTra: tien
    });}
})


module.exports = billRouter;
