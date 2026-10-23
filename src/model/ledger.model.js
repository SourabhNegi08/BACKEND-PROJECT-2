const mongoose = require('mongoose');

const ledgerschema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true , "ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true , "amount is required for creating a ledger entry"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true , "ledger must be required with a transaction"],
        index: true,
        immutable: true
    },
    type:{
        type: String,
        enum:{
            values: ["CREDIT" , "DEBIT"],
            message: "type can be either CREDIT or DEBIT"
        },
        required: [true , "leadger type is required"],
        immutable: true
    }
})

function preventleadgermodification() {
    throw new error("leadger entries are immutable and cannot be modified or deleted");
}

ledgerschema.pre('findOneAndUpdate' , preventleadgermodification)
ledgerschema.pre('updateOne' , preventleadgermodification)
ledgerschema.pre('deleteOne' , preventleadgermodification)
ledgerschema.pre('remove' , preventleadgermodification)
ledgerschema.pre('deleteMany' , preventleadgermodification)
ledgerschema.pre('findOneAndDelete' , preventleadgermodification)
ledgerschema.pre('findOneAndReplace' , preventleadgermodification)

const ledgermodel = mongoose.model("ledger" , ledgerschema)

module.exports = ledgermodel