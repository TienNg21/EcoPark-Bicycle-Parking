const express = require('express');
const historyRouter = express.Router();

historyRouter.get('/', (req, res) => {
    res.render('lichsu.ejs');
})

module.exports = historyRouter;