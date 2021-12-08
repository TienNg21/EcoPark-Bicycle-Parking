
const { Router } = require('express');
const express = require('express');
const rentRouter = express.Router();
const { pool } = require('../dbConfig');

var bai = [];



rentRouter.get("/", async (req, res)=>{
    if(req.user == null) res.redirect('../login')
    console.log("view rent page");
    pool.query("select id_bai_xe, ten_bai from bai_xe ", (err, result)=>{
        console.log(result.rows);
        console.log('in bai lan 1 ');
        res.render("rent.ejs", {baixe: result.rows, bai: '', xe: undefined});
    })
})

rentRouter.get("/:id_bai", async (req, res)=>{
    if(req.user == null) res.redirect('../login')
    // bai = ''
    console.log(req.params.id_bai)
    let id_bai = req.params.id_bai
    pool.query("select id_bai_xe, ten_bai from bai_xe where id_bai_xe = $1", [id_bai], (err, result)=>{
        if(err) console.error(err);
        else{
            bai = result.rows;
            
            console.log(bai);
            // console.log('innn' + bai['ten_bai']);
            // var tenbai = bai['ten_bai']
            // var idbai = bai['id_bai_xe']
            pool.query("select id_xe, trang_thai from xe where id_bai_xe = $1", [id_bai], (err, result)=>{
                
                    console.log(result.rows);
                    console.log('in bai lan 2: ' + id_bai);
                    res.render("rent.ejs", {bai: id_bai, xe: result.rows});
        
                
            })
        }
    })
    

})

rentRouter.post('/chonbai', (req, res)=>{
    console.log(req.body.idbai);
    // res.send('nhan dc roi')
    pool.query("select id_xe, trang_thai from xe where id_bai_xe = $1", [req.body.idbai], (err, result)=>{
        if(err) console.error(err);
        else{
            console.log(result.rows);
            res.send(result.rows)
        }
    })
})

rentRouter.post("/scan", async (req, res)=>{
    console.log(req.body);
    // console.log(req.user);
    pool.query(`update public.xe set trang_thai = 'pending',id_user = ${req.user.id_user} where id_xe = ${req.body.xe};`, async (err, result)=>{
        if(err) console.error(err)
        else {
        console.log('bat dau doi 1phut');
        // doi 5 phut
        await timeout(60000)
        console.log('het 1 phut')
        // kiem tra trang thai hien tai cua xe
        pool.query("select trang_thai, id_user from public.xe where id_xe = $1", [req.body.xe], (err, result)=>{
            if(err) console.error(err)
            else{
            if(result.rows.length == 0){console.error('Khong tim thay xe')}
            else{
                console.log(result.rows[0]['trang_thai'])
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
        }
    })
    res.render('scan.ejs', {bai: req.body.bai})
})

rentRouter.get('/scan', (req, res)=>{
    res.send('get scan')
})

rentRouter.post('/xacnhan', (req, res)=>{
    console.log(req.body);
    // so sanh ma qr, thong bao khi sai, dung
    
    // cap nhat csdl khi quet dung
    // set trang thai xe
    // cap nhat bang lichsuthuexe


})

// tra xe tinh tien


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
module.exports = rentRouter;