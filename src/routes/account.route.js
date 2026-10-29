const express = require('express');
const authmiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');


const router= express.Router();

router.post('/create-account' , authmiddleware.authmiddleware , accountController.createAccount )
router.get('/user-account' , authmiddleware.authmiddleware , accountController.getUserAccount )
router.get('/balance/:accountId' , authmiddleware.authmiddleware , accountController.getAccountBalance )   //jis sccount ka balance chahiya us account ki id bhi dalne padege esmein

module.exports = router;