const express = require('express');
const historyRouter = express.Router();
const { pool } = require('../dbConfig');

historyRouter.get('/', async (req, res) => {
    // console.log(req.user);
    if(req.user == null || req.user.email == process.env.EMAIL_ADMIN) {
        res.redirect('/login');
    }else {
        pool.query(
            `SELECT date_part('year',ls.ngay_thue) as nam,date_part('month',ls.ngay_thue) as thang, date_part('day',ls.ngay_thue) as ngay,
			date_part('hour', ls.bat_dau) as gio_bat_dau, date_part('minute', ls.bat_dau) as phut_bat_dau,
			date_part('hour', ls.ket_thuc) as gio_ket_thuc, date_part('minute', ls.ket_thuc) as phut_ket_thuc ,
			ls.thanh_tien, xe.id_xe, xe.loai_xe, bthue.ten_bai as baithue, btra.ten_bai as baitra
            FROM lich_su_thue_xe ls, xe, bai_xe bthue, bai_xe btra 
            WHERE ls.id_user = ${req.user.id_user}
            AND ls.id_bai_xe_thue = bthue.id_bai_xe
            AND ls.id_bai_xe_tra = btra.id_bai_xe
            AND xe.id_xe = ls.id_xe`,
            (err, result) => {
                // const ls = result;
                console.log(result.rows);
                res.render('lichsu.ejs', {
                    lsu: result.rows
                });
            }
        )

    }
})

module.exports = historyRouter;