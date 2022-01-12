const { Router } = require('express');
const express = require('express');
const billRouter = express.Router();
const { pool } = require('../dbConfig');

billRouter.get('/', (req, res)=>{
    if(req.user == null) res.redirect('../login')
    else{
        console.log("view bill page");
        pool.query("select * from gia_thue_xe", (err, result)=>{
            pool.query("select gia_thue_du_kien, id, extract(hour from bat_dau) as gio_bd, extract(minute from bat_dau) as phut_bd, extract(hour from ket_thuc) as gio_kt, extract(minute from ket_thuc) as phut_kt from lich_su_thue_xe where id_user = $1 and bat_dau is not null and ket_thuc is not null order by id desc limit 1", [req.user.id_user], (err1, result1)=>{
                //tinh thoi gian su dung
                let time = (result1.rows[0].gio_kt*60 + result1.rows[0].phut_kt) - (result1.rows[0].gio_bd*60 + result1.rows[0].phut_bd);
                console.log(time);
                let cost;
                let sale = 0, time_delay = 0, cost_delay = 0;
                
                //chon mot gio
                if(result.rows[0].one_h == result1.rows[0].gia_thue_du_kien){
                    if(time <= 60){
                        cost = result1.rows[0].gia_thue_du_kien;
                    }
                    else{       //qua gio
                        time_delay = time - 60;
                        cost_delay = time_delay * result.rows[0].delay_h / 30;
                        cost = Number(cost_delay) + Number(result1.rows[0].gia_thue_du_kien);
                    } 
                    if(req.user.la_cu_dan){         //la cu dan thi giam gia
                        sale = result.rows[0].disc;
                        cost = cost * (1 - sale / 100);
                    }
                    //update lichsuthuexe
                    pool.query("update lich_su_thue_xe set gio_thue_du_kien = 1, thanh_tien = $1 where id = $2", [cost, result1.rows[0].id]);
                    //gui du lieu sang oke.ejs
                    pool.query("select *, substring(cast(ngay_thue as varchar(20)) from 9 for 2) as ngay, substring(cast(ngay_thue as varchar(20)) from 6 for 2) as thang, substring(cast(ngay_thue as varchar(20)) from 1 for 4) as nam, substring(cast(bat_dau as varchar(10)) from 1 for 8) as bat_dau, substring(cast(ket_thuc as varchar(10)) from 1 for 8) as ket_thuc from lich_su_thue_xe where id = $1", [result1.rows[0].id], (err2, result2)=>{
                        res.render("bill.ejs", {lichsu: result2.rows, giam_gia: sale, tg_muon: time_delay, gia_muon: cost_delay, ten: req.user.ten})
                    })
                }

                //chon hai gio
                else if(result.rows[0].two_h == result1.rows[0].gia_thue_du_kien){
                    if(time <= 120){
                        cost = result1.rows[0].gia_thue_du_kien;
                    }
                    else{       //qua gio
                        time_delay = time - 120;
                        cost_delay = time_delay * result.rows[0].delay_h / 30;
                        cost = Number(cost_delay) + Number(result1.rows[0].gia_thue_du_kien);
                    }
                    if(req.user.la_cu_dan){         //la cu dan thi giam gia
                        sale = result.rows[0].disc;
                        cost = cost * (1 - sale / 100);
                    }
                    //update lichsuthuexe
                    pool.query("update lich_su_thue_xe set gio_thue_du_kien = 2, thanh_tien = $1 where id = $2", [cost, result1.rows[0].id]);
                    //gui du lieu sang oke.ejs
                    pool.query("select *, substring(cast(ngay_thue as varchar(20)) from 9 for 2) as ngay, substring(cast(ngay_thue as varchar(20)) from 6 for 2) as thang, substring(cast(ngay_thue as varchar(20)) from 1 for 4) as nam, substring(cast(bat_dau as varchar(10)) from 1 for 8) as bat_dau, substring(cast(ket_thuc as varchar(10)) from 1 for 8) as ket_thuc from lich_su_thue_xe where id = $1", [result1.rows[0].id], (err2, result2)=>{
                        res.render("bill.ejs", {lichsu: result2.rows, giam_gia: sale, tg_muon: time_delay, gia_muon: cost_delay, ten: req.user.ten})
                    })
                }

                //chon ba gio
                else{
                    if(time <= 180){
                        cost = result1.rows[0].gia_thue_du_kien;
                    }
                    else{       //qua gio
                        time_delay = time - 180;
                        cost_delay = time_delay * result.rows[0].delay_h / 30;
                        cost = Number(cost_delay) + Number(result1.rows[0].gia_thue_du_kien);
                    }
                    if(req.user.la_cu_dan){         //la cu dan thi giam gia
                        sale = result.rows[0].disc;     
                        cost = cost * (1 - sale / 100);
                    }
                    //update lichsuthuexe
                    pool.query("update lich_su_thue_xe set gio_thue_du_kien = 3, thanh_tien = $1 where id = $2", [cost, result1.rows[0].id]);
                    //gui du lieu sang oke.ejs
                    pool.query("select *, substring(cast(ngay_thue as varchar(20)) from 9 for 2) as ngay, substring(cast(ngay_thue as varchar(20)) from 6 for 2) as thang, substring(cast(ngay_thue as varchar(20)) from 1 for 4) as nam, substring(cast(bat_dau as varchar(10)) from 1 for 8) as bat_dau, substring(cast(ket_thuc as varchar(10)) from 1 for 8) as ket_thuc from lich_su_thue_xe where id = $1", [result1.rows[0].id], (err2, result2)=>{
                        res.render("bill.ejs", {lichsu: result2.rows, giam_gia: sale, tg_muon: time_delay, gia_muon: cost_delay, ten: req.user.ten})
                    })
                }
            })
        })
    }
})
module.exports = billRouter;
