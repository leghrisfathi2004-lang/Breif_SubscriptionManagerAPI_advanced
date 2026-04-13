const { boolean, number, required } = require('joi');
const mongoose = require('mongoose');

//for user ----------
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

//for subs ----------
const subSchema = new mongoose.Schema({
    //id genere auto par mongodb
    name: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ["yearly", "monthly"], required: true },
    createdAt: { type: Date, default: Date.now },
    startDate: {type: Date , default: Date.now},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {type: String , enum: ["cancelled", "active"], default:"active"}
})

//for trans ---------------
const tranSchema = new mongoose.Schema({
    //id genere auto par mongodb
    amount: {type: Number, required: true},
    paymentDate: {type: Date, default: Date.now },
    subId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sub',
        required: true 
    },
    createdAt: {type: Date, default: Date.now }
});
const tran = mongoose.model('tran', tranSchema)
const user = mongoose.model('User', userSchema);
const sub = mongoose.model('Sub', subSchema);

module.exports = {user, sub, tran};

