// models/UserRegistration.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Password hashing middleware
userRegistrationSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userRegistrationSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('UserRegistration', userRegistrationSchema);

