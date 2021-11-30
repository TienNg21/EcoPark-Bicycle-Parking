const express = require('express');
const adminRouter = express.Router();

adminRouter.get('/', (req,res) => {
    res.render('admin.ejs');
})

adminRouter.post('/baixe', (req,res) => {

})



adminRouter.get('/logout', (req,res) =>{
    res.redirect('/logout');
})
module.exports = adminRouter;