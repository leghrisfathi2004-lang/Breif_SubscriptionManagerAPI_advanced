const { respond } = require('./respond.js');
const {user, sub, tran} = require('../database/module.js');

const ownSub = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const id = req.params.id;
        const SUB = await sub.findById(id);
        if(!SUB || SUB.userId === userId)
            return respond(res, 404, "wrong subscribe id!");
        next(); 
    } catch(e) {
        respond(res, 500, e.message)
    }
}

const owntran = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const TRAN = await tran.findById(id);
        if (!TRAN) return respond(res, 404, "transaction not found!");
        const SUBS = await sub.find({ userId });

        if (SUBS.length === 0) 
            return respond(res, 400, "user has no subscriptions!");

        for (const el of SUBS) {
            if (el._id.equals(TRAN.subId)) {
                console.log("transaction found");
                return next();
            }
        }

        return respond(res, 401, "wrong transaction id!");

    } catch (e) {
        respond(res, 500, e.message);
    }
};

module.exports = { ownSub, owntran };