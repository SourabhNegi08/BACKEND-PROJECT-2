const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required for creating a user'],
        trim: true,
        unique: [true, 'Email already exists'],
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    name: {
        type: String,
        required: [true, 'Name is required for creating a user'],
    },
    password: {
        type: String,
        required: [true, 'Password is required for creating a user'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Exclude password from query results by default
    },
    systemuser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
} , {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

userSchema.pre('save' , async function () {     // ye password ko hash mein convert kardege save hone se pehla
    if(!this.isModified('password')) {
        return ;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return ;
})

userSchema.methods.comparePassword = async function (password){   //ye agar pass true hai to true return karega nahi to false return karega
    return await bcrypt.compare(password, this.password);
}

const usermodel = mongoose.model('user' , userSchema);

module.exports = usermodel;

