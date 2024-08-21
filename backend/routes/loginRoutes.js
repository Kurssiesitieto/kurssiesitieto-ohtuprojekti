const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('loyda tama', req.headers.kirjauduttu)
    console.log('uid', req.headers.user)
    res.json({
        kirjauduttu: req.kirjauduttu,
        user: req.user
    });
});

module.exports = router;