const usermodel = require('../model/user.model');
const jwt = require('jsonwebtoken');

async function authmiddleware(req, res, next) {
    const token = req.cookies.token;

    if( !token ) {
        return res.status(401).json({
            message: "Unauthorized access",
            status: "failed"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.userId);
        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({
            message: "Unauthorized access",
            status: "failed"
        })
    }
}

module.exports = { authmiddleware }