const mongoose = require('mongoose')

const tokenblacklistschema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to blacklist"],
        unique: [true, "token is already blacklisted"]
    }
} , {
    timestamps: true
})

tokenblacklistschema.index({ createdAt: 1 } , {expireAfterSeconds: 60*60*24* 3 })    //3 DAYS

const tokenblacklistmodel = mongoose.model("tokenblacklist" , tokenblacklistschema)

module.exports = tokenblacklistmodel;