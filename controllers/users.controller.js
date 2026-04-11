const crypt = require("bcrypt");
const token = require('jsonwebtoken');
const {resMessage, resData} = require('../middleware/respond.js');
const {user, sub, tran} = require('../database/module.js');


const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const exist = await user.findOne({ email });
        if (exist)
            return resMessage(res, 409, "email exist!");
        const hashPass = await crypt.hash(password, 10);
        if(req.body.role && req.body.role === "admin"){
            await user.create({name, email, password: hashPass, role: req.body.role})
            return resData({name, email, type: "admin"});
        }
        await user.create({name, email, password: hashPass});
        return resData(res, 201, { name, email, type: "user"});
    } catch(e) {
        return resMessage(res, 500, e.message);
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const emCheck = await user.findOne({ email });
        if (!emCheck)
            return resMessage(res, 422, "email dosnt exist!");
        const passCheck = await crypt.compare(password, emCheck.password);
        if (!passCheck)
            return resMessage(res, 422, "wrong password!");
        const jwt = token.sign(
            { name: emCheck.name, email: emCheck.email, role:emCheck.role },
            process.env.jwt_code,
            { expiresIn: process.env.jwt_expire }
        );
        return res.status(200).json({
            message: "Log In successfuly!",
            token: jwt,
            user: { name: emCheck.name, email: emCheck.email }
        });
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const getUser = async (req, res) => {
    try {
        const { email } = req.user;
        const USER = await user.findOne({ email }).select("-password").lean();
        //wkha ra mimknch ms en case
        if (!USER)
            return resMessage(res, 404, "email not exist");

        // const SUBS = await getUserSubs(email);
        // const TRANS = await getTrans()
        //     return resData(res, 200, { USER, SUBS, trans });

        const resultat = await user.aggregate([
            { $match: { email } },
            { $lookup: {
                from: "sub",
                localField: "email",
                foreignField: "userEmail",
                as: "subscriptions"
            }},

            { $unwind: "$subscriptions"},

            { $lookup: {
                from: "tran",
                localField: "subscriptions._id",
                foreignField: "subId",
                as: "subscriptions.transactions"
            }},
            { $group: {
                _id: "$email",
                email: { $first: "$email" },
                subs: { 
                    $push: {
                        name: "$subscriptions.name",
                        price: "$subscriptions.price",
                        transactions: "$subscriptions.transactions",
                        totalSub: { $sum: "$subscriptions.transactions.amount"}
                        }
                    }
                }
            },
            { $addFields: {
                totalSpent: { $sum: "$subscriptions.totalSub"  }
                }
            }
        ]) 

        return resData(res, 200, resultat);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { useremail } = req.user;
        const resUser = await user.deleteOne({ email: useremail });
        if (!resUser.deletedCount)
            return resMessage(res, 404, "user not found");
        await sub.deleteMany({ userEmail: useremail });
        return resMessage(res, 202, "user and their subs delet en success!");
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const USERS = await user.find({}).select("-password").lean();
        if (!USERS || USERS.length === 0)
            return resMessage(res, 404);
        resData(res, 200, USERS);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}


module.exports = {register, login, getUser, deleteUser, getAllUsers}

// |--> Helper functions

