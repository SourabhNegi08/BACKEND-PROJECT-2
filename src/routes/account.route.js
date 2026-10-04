const express = require('express');
const authmiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');


const router= express.Router();

router.post('/create-account' , authmiddleware.authmiddleware , accountController.createAccount )

module.exports = router;