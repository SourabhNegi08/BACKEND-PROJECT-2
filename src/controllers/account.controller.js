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

module.exports = { createAccount }