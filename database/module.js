const { ref, boolean } = require('joi');
const mongoose = require('mongoose');

//for user ----------
const userShema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

//for subs ----------
const subShema = new mongoose.Schema({
    //id genere auto par mongodb
    name: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userEmail: {
        type: String,
        ref: 'User',
        required: true
    },
    startDate: { type: Date, default: createdAt},
    active: { type: boolean, default: false}
})

//for transaction -------
const traShema = new mongoose.Schema({
    //auto denrated id by mongo
    amount: { type: Number, required: true},
    paymentDate: { type: Date, required: true},
    createdAt: { type: Date, default: Date.now },
    subId: {
        type: Number,
        ref: 'Sub',
        required: true
    }
});

const user = mongoose.model('User', userShema);
const sub = mongoose.model('Sub', subShema);
const tran = mongoose.model('Transiction', traShema);

module.exports = {user, sub, tran};

