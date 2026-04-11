const {user, sub, tran} = require('../database/module.js');
const {resData, resMessage} = require('../middleware/respond.js')

const addSub = async (req, res) => {
    try{
        let b = req.body;
        if(!b.name || !b.price || !b.billingCycle || !req.user.email )
            return resMessage(res, 400, "required fields missing!");
        const newSub = new sub({
            name: b.name, 
            price: b.price, 
            billingCycle: b.billingCycle,
            userEmail: req.user.email,
            
        });
        let resultat = await newSub.save();
        if(!resultat)
            return resMessage(res, 400, "database errour!")
        resMessage(res, 201, "created successfully!");
    }catch(e) {
        return resMessage(res, 500, e.message)
    }
}

const deleteSub = async (req, res) => {
    try{
        const id = req.body.subId; 
        if(!id)
            return resMessage(res, 404, "id requuired!");
        if(checkSub(id, req.user.email))
            return resMessage(res, 401, "no access!");
        let resultat = await sub.deleteOne({ _id: id});
        if(resultat.deleteOne === 0)
            return resMessage(res, 404, "Delete failed!");
        resMessage(res, 204, "Deleted successfully!");
    }catch(err){
        return resMessage(res, 500, e.message);
    }
}

const getAllSubs = async (req, res) => {
    try{
        const subs = await sub.find({}).lean();
        if(!subs)
            return resMessage(res, 204, "Empty!");
        resData(res, 200, subs);
    }catch{
        return resMessage(res, 500, e.message)
    }
}

const getUserSubs = async (req, res) => {
    try {
        if(!req.user.email) 
            return resMessage(res, 400, "missing required fields");
        const subs = await sub.find({ userEmail: req.user.email }).lean();
        if(!subs)
            return resMessage(res, 204, "Empty!");
        resData(res, 200, subs);
    } catch(e){
        return resMessage(res, 500, e.message);
    }
}

//use this for active / cancel
const updateSub = async (req, res) => {
    try{
        const id = req.body.subId;
        let flag = true;
        if(!id || !req.body)
            return resMessage(res, 400, "required fields missing!");
        //filter updation data
        const list = ['name', 'price','active'];
        const newdata = {};

        Object.keys(req.body).forEach( el => {
            if(list.includes(el)){
                newdata[el] = data[el];
                flag = false;
            }
        })
        //check if the newdata has any info
        if(flag)
            return resMessage(res, 404, "no allowed fileds!");
        const resultat = await sub.findByIdAndUpdate(id, {$set: newdata}, {new: true, runValidators: true});
        if(!resultat)
            return resMessage(res, 400, "update failed!");
        resMessage(res, 200, "updated success");
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const filterSubs = async (req, res) =>{
    try{
        const { id, name, price} = req.query;
        let subInfo = { email: req.user.email};
        if(id)      subInfo._id = id;
        if(name)    subInfo.name = name;
        if(price)   subInfo.price = price;

        const subs = await sub.find(subInfo);
        if(!subs.length)
            return resMessage(res, 404, "filtred subs not found");
        return resData(res, 200, subs);
    }catch(e) {
        resMessage(res, 500, e.message)
    }
}


//transaction-----
const addTran = async (req, res) => {
    try{
        const {amount, paymentDate, subId} = req.body;
        if(!amount || !paymentDate || !subId)
            return resMessage(res, 400, "missing required fields!");
        const newtran = new tran ({
            amount: amount,
            paymentDate: paymentDate,
            subId: subId
        });

        let resultat = await newtran.save();
        if(!resultat)
            return resMessage(res, 400, "crated faild!");
        resMessage(res, 201, "created successfully!");
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

// funstions----------



module.exports = {addSub, deleteSub, patchSub, getAllSubs, getUserSubs, filterSubs, addTran, updateSub};