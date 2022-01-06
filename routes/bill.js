const express = require('express');
const { pool } = require('../dbConfig');
const billRouter = express.Router();

billRouter.get('/', (req, res)=>{
    res.render('oke')
})
const ngay, tenkh, thoiGianDuKien, batdau, ketthuc;
let bill, muon;
billRouter.get('/', async (req, res)=>{
    ngay = await pool.query('select ngay_thue from lich_su_thue_xe where id_user = $1 order by ngay_thue desc limit 1', [req.body.id_user]);
    tenkh = await pool.query('select ten from khach_hang where id_user = $1', [req.body.id_user]);
    thoiGianDuKien = await pool.query('select thoi_gian_du_kien from lich_su_thue_xe where id_user = $1 order by bat_dau desc limit 1', [req.body.id_user]);
    batdau = await pool.query('select bat_dau from lich_su_thue_xe where id_user = $1 order by bat_dau desc limit 1', [req.body.id_user]);
    ketthuc = await pool.query('select ket_thuc from lich_su_thue_xe where id_user = $1 order by ket_thuc desc limit 1', [req.body.id_user]);
    bill = Tinhtien();
    res.render('bill.ejs', {
        ngay: ngay,
        tenkh: tenkh,
        thoigian: thoiGianDuKien,
        batdau: batdau,
        ketthuc: ketthuc,   
        muon: muon,
        tienPhaiTra: bill
    });
})

function Tinhtien(){
    let tien, donGia,tienphat, tieng = ketthuc.getHours() - batdau.getHours();
    //Lấy đơn giá thuê theo bảng giá
    if(thoiGianDuKien == 1){
        donGia = pool.query(`select one_h from gia_thue_xe`);
    }
    if(thoiGianDuKien==2){
        donGia = pool.query(`select two_h from gia_thue_xe`);
    }
    if(thoiGianDuKien==3){
        donGia = pool.query(`select three_h from gia_thue_xe`);
    }
    //Tính tiền nếu trả đúng hạn
    if(tieng<=thoiGianDuKien){
        muon = 0;
        tien= donGia*thoiGianDuKien;
    }
    //Tính tiền nếu trả muộn
    tienphat = pool.query(`select delay_h from gia_thue_xe`);
    if(tieng>thoiGianDuKien ){
        muon = ketthuc.getHours()*60 + ketthuc.getMinutes() -(batdau.getHours()*60+batdau.getMinutes());
        tien = donGia*thoiGianDuKien + (muon/30)*tienphat;
    }
    return tien;
    
}
module.exports = billRouter;
