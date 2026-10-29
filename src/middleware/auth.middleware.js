const usermodel = require('../model/user.model');
const tokenblacklistmodel = require('../model/blacklist.model');

const jwt = require('jsonwebtoken');

async function authmiddleware(req, res, next) {
    const token = req.cookies.token;

    if( !token ) {
        return res.status(401).json({
            message: "Unauthorized access",
            status: "failed"
        })
    }

    const istokenblacklisted = await tokenblacklistmodel.findOne({token})
    if(istokenblacklisted){
        return res.status(401).json({
            message: "unauthorized access , token is invaild"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.userId);
        req.user = user;
        return next();
    } catch(err) {
        return res.status(401).json({
            message: "Unauthorized access",
            status: "failed"
        })
    }
}

    async function authsystemusermiddleware (req , res , next){
        const token = req.cookies.token || req.headers.authorization?.split("")[1];


        if( !token ) {
            return res.status(401).json({
                message: "Unauthorized access",
                status: "failed"
            })
        }

        const istokenblacklisted = await tokenblacklistmodel.findOne({token})
        if(istokenblacklisted){
            return res.status(401).json({
                message: "unauthorized access , token is invaild"
            })
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await usermodel.findById(decoded.userId).select("+systemuser");
            if(!user.systemuser){
                return res.status(403).json({
                    message:"forbidden access , not a system user"
                })
            }
            req.user = user;
            return next();
        } catch(error){
            return res.status(401).json({
                message: "Unauthorized access",
                status: "failed"
            })
        }

    }

module.exports = { authmiddleware , authsystemusermiddleware }