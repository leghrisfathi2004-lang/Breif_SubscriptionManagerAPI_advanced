const {user, sub, tran} = require('../database/module.js');
const {respond} = require('../middleware/respond.js');

const addTran = async (req, res) => {
    try{
        const {id} = req.user;
        const subId = req.params.id;
        const {amount, paymentDate } = req.body;
        const SUB = await sub.findById(subId);
        if( !amount || !SUB || SUB.price !== amount)
            return respond(res, 400, "missing required fields or incorrect!");
        await tran.create({amount, paymentDate, subId, id});
        respond(res, 200, "transaction add succsefully");
    } catch (e) {
        respond(res, 500, e.message)
    }
}

const deleteTran = async (req, res) => {
    try{
        const {id} = req.params;
        const deleted = await tran.deleteOne({_id: id});
        if(!deleted)
            return respond(res, 404, "Transaction not deleted!");
        return respond(res, 202, "Transaction deleted en success!");
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const getAllTran = async (req, res) => {
    try{
        const trans = await tran.find({});
        respond(res, 200, trans);
    } catch(e) {
        respond(res, 500, e.message);
    }
}

module.exports = {addTran, deleteTran, getAllTran};