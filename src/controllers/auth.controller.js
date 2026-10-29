const usermodel = require('../model/user.model');
const tokenblacklistmodel = require('../model/blacklist.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service')

async function userRegisterController(req, res) {

    const {email, name, password} = req.body;

    const isUserExist = await usermodel.findOne({
        email: email
    })

    if(isUserExist) {
        return res.status(422).json({ 
            message: "User already exists",
            status: "failed"
         });
    }

    const user = await usermodel.create({  //user is registered successfully
        name , email , password
    })

    const token = jwt.sign({
        userId: user._id
    } , process.env.JWT_SECRET , { expiresIn: "78h" })

    res.cookie("token" , token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })

    await emailService.sendRegistrationEmail(user.email, user.name); // Send registration email after successful registration
}

async function userLoginController(req, res) {
    const { email , password } = req.body;

    const user = await usermodel.findOne({
        email: email
    }).select('+password')
    
    if(!user) {
        return res.status(401).json({
            message: "User does not exist",
            status: "failed"
        })
    }

    const isvalidpassword = await user.comparePassword(password);
    if(!isvalidpassword) {
        return res.status(401).json({
            message: "invalid password",
            status: "failed"
        })
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET, { expiresIn: "78h" });

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    });
}

async function userLogoutController(req , res){
    const token = req.cookie.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(200).json({
            message: "user logout successfully"
        })
    }
    res.clearCookie("token")

    await tokenblacklistmodel.create({
        token: token
    })

    res.status(200).json({
        message: "user logout successfully"
    })
}


module.exports = { userRegisterController, userLoginController };