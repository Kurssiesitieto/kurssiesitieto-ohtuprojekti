const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.redirect('/esitieto')
});


module.exports = router;