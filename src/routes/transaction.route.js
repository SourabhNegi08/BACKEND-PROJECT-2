const { router } = require('express')
const authmiddleware = require("../middleware/auth.middleware")
const transactioncontroller = require('../controllers/transaction.controller')

const transactionroutes = router();

transactionroutes.post("/" , authmiddleware.authmiddleware , transactioncontroller.createTransaction)

module.exports = transactionroutes