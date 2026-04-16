const {user, sub, tran} = require('../database/module.js');
const {respond} = require('../middleware/respond.js');

const addSub = async (req, res) => {
    try{
        const userId = req.user.id;
        const {name, price, billingCycle, startDate, status} = req.body;
        if( !name || !price || !billingCycle || !userId )
            return respond(res, 400, "missing required fields!");

        const newSub = new sub({
            name: name, 
            price: price, 
            billingCycle: billingCycle,
            userId,
            status,
            startDate
        });
        const resultat = await newSub.save();
        return respond(res, 201, resultat);
    }catch(e) {
        return respond(res, 500, e.message)
    }
}

const deleteSub = async (req, res) => {
    try{
        const id = req.params.id; 
        if(!id)
            return respond(res, 404);
        let resultat = await sub.deleteOne({ _id: id});
        if(resultat.deleteOne === 0)
            return respond(res, 404, "subscribe not found!");
        await tran.deleteMany({subId: id});
        respond(res, 200);
    }catch(e){
        return respond(res, 500, e.message);
    }
}

const getAllSubs = async (req, res) => {
    try{
        const subs = await sub.find({}).lean();
        if(!subs)
            return respond(res, 202);
        respond(res, 200, subs);
    }catch(e){
        respond(res, 500, e.message);
    }
}

const updateSub = async (req, res) => {
    try{
        const {id} = req.params;
        let {name, price, billingCycle, status} = req.body;
        const SUB = await sub.findById(id);
        if(!SUB || !name || !price || !billingCycle )
            return respond(res, 400, "required fileds missing or wrong!");
        status ||= SUB.status;
        const newSub = await sub.findByIdAndUpdate(
            id,
            { $set: { name, price, billingCycle, status} },
            { returnDocument: 'after' });
        respond(res, 200, newSub);
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const cancelSub = async (req, res) => {
    try{
        const {id} = req.params;
        const SUB = await sub.findById(id);
        if(!SUB || SUB.status === "cancel" )
            return respond(res, 400, "wrong subscribe id, or already cancelled!");
        const newSub = await sub.findByIdAndUpdate(
            id,
            { $set: {status: "cancel"} },
            { returnDocument: 'after'} );
        respond(res, 200, newSub);
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const filterSub = async (req, res) => {
    try{
        const {id, name, price} = req.query;
        let subInfo = {userId: req.user.id};
        if(id)    subInfo._id = id;
        if(name)    subInfo.name = name;
        if(price)    subInfo.price = price;
        const subs = await sub.find(subInfo);
        if(!subs)   return respond(res, 404, "no subscribe founds matching ur filter!");
        respond(res, 200, subs);
    } catch(e) {
        respond(res, 500, e.message);
    }
}


module.exports = {addSub, deleteSub, getAllSubs, updateSub, cancelSub, filterSub};