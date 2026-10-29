const { Router } = require('express')
const authmiddleware = require("../middleware/auth.middleware")
const transactioncontroller = require('../controllers/transaction.controller')

const transactionroutes = Router();

transactionroutes.post("/" , authmiddleware.authmiddleware , transactioncontroller.createTransaction)
transactionroutes.post("/system/initial-fund" , authmiddleware.authsystemusermiddleware , transactioncontroller.createInitialFundTransaction)

module.exports = transactionroutes