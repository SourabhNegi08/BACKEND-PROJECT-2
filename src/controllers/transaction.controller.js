const transactionmodel = require('../model/transaction.model') 
const ledgermodel = require('../model/ledger.model')
const accountmodel = require('../model/account.model')
const emailservice = require('../services/email.service') 
const mongoose = require('mongoose')

/**
 * create a new transaction 
 * THE 10 STEP TRANSFER FLOW:
 * 
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (pending)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction completed
 * 9. Comit mongoDB session
 * 10. send email notification
 */

async function createTransaction(req , res){
    const { fromAccount, toAccount , amount , idempotencyKey } = req.body;

    /**
     * 1. Validate request 
     */
    if( !fromAccount || !toAccount || !amount || !idempotencyKey ){
        return res.status(400).json({
            message: "all information is required"
        })
    }
    const fromUserAccount = await accountmodel.findOne({
        fromAccount: fromAccount
    })
    const toUserAccount = await accountmodel.findOne({
        toAccount: toAccount
    })
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "invalid fromAccount or toAccount",
        })
    }

    /**
     * 2. Validate idempotency key
     */
    const isTransactionAlreadyExist = await transactionmodel.findOne({
        idempotencyKey : idempotencyKey
    })
    if(isTransactionAlreadyExist){
        if(isTransactionAlreadyExist.status === "COMPLETED"){
            return res.status(200).json({
                message: "transaction already exist",
                transaction: isTransactionAlreadyExist
            })
        }
        if(isTransactionAlreadyExist.status === "PENDING"){
            return res.status(200).json({
                message: "transaction is in process",
            })
        }
        if(isTransactionAlreadyExist.status === "FAILED"){
            return res.status(500).json({
                message: "previous trasaction got failed , please try again",
            })
        }
        if(isTransactionAlreadyExist.status === "REVERSED"){
            return res.status(500).json({
                message: "transaction was reversed please retry",
                transaction: isTransactionAlreadyExist
            })
        }
    }

    /**
     * 3. Check account status
     */
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "both fromAccount and toAccount must be active to perform transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance();

    if(balance < amount) {
        return res.status(400).json({
            message: `insufficient balance in fromAccount , current balance is ${balance}`
        })
    }

    /**
     * 5. Create transaction (pending)
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionmodel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
    } , { session })

    const debitledgerentry = await ledgermodel.create({
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    },   { session })

    const creditledgerentry = await ledgermodel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    },   { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()

    /**
     * 10. send email notification
     */
    await emailservice.sendTransactionEmail(req.user.email, req.user.name , req.user.transaction)

    return res.status(201).json({
        message: "transaction completed successfully",
        transaction: transaction
    })
}

module.exports = { createTransaction }