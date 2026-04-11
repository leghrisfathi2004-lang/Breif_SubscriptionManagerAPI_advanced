const {resMessage} = require('./respond.js');
const { user, sub, tran} = require('../database/module.js');

const checkSub = async (req, res, next) => {
    try{
        const id = req.body.subId;
        const email = req.user.email;
        const SUB = await sub.findById(id);
        if(SUB.userEmail !== email)
            return resMessage(res, 401, "not your subscribe")
        next();
    } catch(e) {
        resMessage(res, 401, "sub not yours!")
    }
}

module.exports = {checkSub};                                   