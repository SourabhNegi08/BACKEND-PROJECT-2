const mongoose = require("mongoose");

const transactionschema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true , "transaction must be associated with a from account"],
        index: true
    } , 
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true , "transaction must be associated to a account"],
        index: true
    },
    status: {
        type: String ,
        enum: {
            values: ["PENDING" , "COMPLETED" , "FAILED" , "REVERSED"],
            message: "status can be either pending , completed , failed or reversed"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true , "ammount is required for creating a transaction"],
        min: [0, "transaction amount can not be negative"]
    },
    idempotencyKey: {
        type: String,
        required: [true , "Idemotency key is required for creating a transaction"],
        index: true,
        unique: true
    }
} , {timestamp: true})

const transactionmodel = mongoose.model("transaction" , transactionschema);

module.exports = transactionmodel;