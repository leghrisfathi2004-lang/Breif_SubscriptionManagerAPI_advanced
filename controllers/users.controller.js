const crypt = require("bcrypt");
const token = require('jsonwebtoken');
const {respond} = require('../middleware/respond.js');
const {user, sub, tran} = require('../database/module.js');
const { default: mongoose } = require("mongoose");

const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const exist = await user.findOne({ email });
        if (exist)
            return respond(res, 409);

        const hashPass = await crypt.hash(password, 10);
        await user.create({name, email, password: hashPass, role});
        return respond(res, 201, { name, email, role});
    } catch(e) {
        return respond(res, 500, e.message);
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const emCheck = await user.findOne({ email });
        if (!emCheck)
            return respond(res, 422);
        const passCheck = await crypt.compare(password, emCheck.password);
        if (!passCheck)
            return respond(res, 422);
        const jwt = token.sign(
            {id: emCheck._id, name: emCheck.name, email: emCheck.email, role: emCheck.role },
            process.env.jwt_code,
            { expiresIn: process.env.jwt_expire }
        );
        return res.status(200).json({
            message: "Log In successfuly!",
            token: jwt,
            user: {role: emCheck.role, name: emCheck.name, email: emCheck.email }
        });
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const profile = async (req, res) => {
    try {
        const { id } = req.user;
        const USER = await user.findOne({_id: id}).select("-password").lean();

        if (!USER)
            return respond(res, 404, "user not found!");

        const subscriptions = await sub.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(id) } },
            { 
                $lookup: {
                from: "trans",      
                localField: "_id",
                foreignField: "subId",
                as: "Transactions"
                }
            }
            ]);
            return respond(res, 200, { USER, subscriptions });
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const resUser = await user.deleteOne({_id: id});
        if (!resUser.deletedCount)
            return respond(res, 404, "user not found to delete!");
        const SUBS = await sub.find({ userId: id });
        await sub.deleteMany({ userId: id });
        for (const el of SUBS) {
            await tran.deleteMany({subId: el._id});
        }
        return respond(res, 202, "user and their subs deleted en success!");
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const USERS = await user.find({}).select("-password").lean();
        if (!USERS || USERS.length === 0)
            return respond(res, 202);
        respond(res, 200, USERS);
    } catch(e) {
        respond(res, 500, e.message);
    }
}

module.exports = {register, login, profile, deleteUser, getAllUsers}

// |--> Helper functions
