const mongoose = require('mongoose');
const ledgermodel = require('./ledger.model');

const accountschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "account must belong to a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["active", "frozen", "closed"],
            message: "status must be either active, frozen or closed",
        },
        default: "active",
    },
    currency: {
        type: String,
        required: [true, "currency is required for creating an account"],
        default: "INR",
    }
} , {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
})

accountschema.index({ user: 1, status: 1 })

const accountmodel = mongoose.model('account' , accountschema);

accountschema.methods.getBalance = async function () {
    const balanceData = await ledgermodel.aggregate([
        {$match: {account: this._id}},
        {
            $group: {
                _id: null,
                totaldebit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type", "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalcredit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalcredit", "$totaldebit"]
                }
            }
        }
    ]);

    if (balanceData.length === 0) {
        return 0;
    }
    return balanceData[0].balance;
}

module.exports = accountmodel;