const usermodel = require('../model/user.model');
const jwt = require('jsonwebtoken');

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
    })



}


module.exports = { userRegisterController };