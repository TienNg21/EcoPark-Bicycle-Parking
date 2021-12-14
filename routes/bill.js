const express = require('express');
const billRouter = express.Router();

billRouter.get('/', (req, res)=>{
    res.render('oke')
})
module.exports = billRouter;
