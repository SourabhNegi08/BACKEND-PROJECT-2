const accountmodel = require('../model/account.model');
const jwt = require('jsonwebtoken');

async function createAccount(req, res) {
        const user = req.user; // Get the authenticated user from the request object

        const account = await accountmodel.create({
            user: user._id,
        })

        res.status(201).json({
            message: "Account created successfully",
            account
        })
}

async function getUserAccount (req, res){
    const user = req.body;

    const account = await accountmodel.findOne({
        user: user._id
    })
    res.status(200).json({
        account
    })
}

async function getAccountBalance (req , res){
    const { accountId } = req.params;

    const account = await accountmodel.findOne({
        _id: accountId,
        user: req.user._id
    })
    if(!account){
        return res(404).json({
            message: "acount not found"
        })
    }

    //we already create a method in accountmodel to get balance
    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance : balance
    })

}
module.exports = { createAccount , getUserAccount , getAccountBalance }